const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const mongoose = require('mongoose');
const NotificationService = require('../utils/notificationService');


// Helper to convert id to ObjectId safely
const toObjectId = (id) => {
  try {
    return mongoose.Types.ObjectId(id);
  } catch (e) {
    return null;
  }
};

// @desc    Get user wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('walletBalance name email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transactions = await Transaction.find({ user: userId })
      .populate('gig', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    const pendingWithdrawals = await Withdrawal.find({
      user: userId,
      status: { $in: ['pending', 'processing'] }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        transactions,
        pendingWithdrawals
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get wallet statistics
// @route   GET /api/wallet/stats
// @access  Private
exports.getWalletStats = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const objectUserId = toObjectId(userId) || userId; // fallback to raw id if conversion fails

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalEarnings, monthlyEarnings, totalTransactions, completedWithdrawals] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: objectUserId, type: 'credit' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        {
          $match: {
            user: objectUserId,
            type: 'credit',
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.countDocuments({ user: userId }),
      Withdrawal.aggregate([
        {
          $match: {
            user: objectUserId,
            status: 'completed'
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings[0]?.total || 0,
        totalTransactions: totalTransactions || 0,
        totalWithdrawn: completedWithdrawals[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw from wallet
// @route   POST /api/wallet/withdraw
// @access  Private
exports.withdrawFromWallet = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.user?.id;
    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Ensure amount is numeric
    const rawAmount = req.body.amount;
    const amount = typeof rawAmount === 'string' ? parseFloat(rawAmount) : Number(rawAmount);

    if (!amount || isNaN(amount) || amount <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid withdrawal amount'
      });
    }

    const paymentMethod = req.body.paymentMethod || 'paypal';

    const minWithdrawal = 5.0;
    if (amount < minWithdrawal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is $${minWithdrawal}`
      });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.walletBalance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance in your wallet'
      });
    }

    // Check for pending withdrawals
    const pendingWithdrawal = await Withdrawal.findOne({
      user: userId,
      status: { $in: ['pending', 'processing'] }
    }).session(session);

    if (pendingWithdrawal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'You already have a pending withdrawal request'
      });
    }

    // Create withdrawal request (use create with session)
    const [withdrawal] = await Withdrawal.create([{
      user: userId,
      amount: amount,
      paymentMethod: paymentMethod,
      status: 'pending',
      userEmail: user.email,
      userName: user.name
    }], { session });

    // Reserve funds by deducting from wallet
    const newBalance = user.walletBalance - amount;
    await User.findByIdAndUpdate(
      userId,
      { walletBalance: newBalance },
      { session }
    );

    // Create transaction record
    await Transaction.create([{
      user: userId,
      type: 'debit',
      amount: amount,
      description: `Withdrawal request #${withdrawal._id}`,
      balanceAfter: newBalance,
      metadata: {
        withdrawalId: withdrawal._id,
        paymentMethod: paymentMethod,
        status: 'pending'
      }
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // ✅ ADD: Notify admins about withdrawal request
    try {
      await NotificationService.notifyWithdrawalRequested(withdrawal, user);
    } catch (notifyError) {
      console.error('Failed to send withdrawal notification:', notifyError);
    }

    // ✅ ADD: Notify user that withdrawal was requested
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Withdrawal Requested',
        message: `Your withdrawal request for $${amount} has been received and is being processed.`,
        data: {
          withdrawalId: withdrawal._id,
          amount: amount,
          metadata: {
            paymentMethod: paymentMethod,
            estimatedProcessing: '2-3 business days'
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Failed to send withdrawal confirmation:', notifyError);
    }


    // Process withdrawal asynchronously (in production, use a queue/job)
    // Use module.exports to ensure function reference is available
    setTimeout(() => {
      try {
        if (module && typeof module.exports.processWithdrawal === 'function') {
          module.exports.processWithdrawal(withdrawal._id);
        } else {
          // Fallback: require this file and call processWithdrawal
          const controller = require('./walletController'); // adjust path if filename differs
          if (controller && typeof controller.processWithdrawal === 'function') {
            controller.processWithdrawal(withdrawal._id);
          }
        }
      } catch (err) {
        console.error('Error scheduling withdrawal processing:', err);
      }
    }, 2000);

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: {
        withdrawalId: withdrawal._id,
        newBalance: newBalance,
        estimatedProcessing: '2-3 business days'
      }
    });
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (e) {
      console.error('Error aborting transaction:', e);
    } finally {
      session.endSession();
    }
    next(error);
  }
};

// @desc    Process withdrawal (simulated - replace with actual PayPal/Stripe)
// @route   INTERNAL
exports.processWithdrawal = async (withdrawalId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const withdrawal = await Withdrawal.findById(withdrawalId).session(session);
    if (!withdrawal || withdrawal.status !== 'pending') {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Update to processing
    withdrawal.status = 'processing';
    await withdrawal.save({ session });

    // 🎯 PRODUCTION: Replace this simulated block with actual PayPal Payouts API call
    const isSuccess = Math.random() > 0.1; // 90% success simulation

    if (isSuccess) {
      withdrawal.status = 'completed';
      withdrawal.processedAt = new Date();
      withdrawal.payoutBatchId = `BATCH_${Date.now()}`; // Simulated batch ID

      console.log(`✅ Withdrawal ${withdrawalId} processed successfully`);
    } else {
      withdrawal.status = 'failed';
      withdrawal.failureReason = 'Simulated payment failure - In production, this would be the actual error from PayPal';

      // Refund amount to user's wallet
      await User.findByIdAndUpdate(
        withdrawal.user,
        { $inc: { walletBalance: withdrawal.amount } },
        { session }
      );

      // Create refund transaction
      const updatedUser = await User.findById(withdrawal.user).session(session);

      await Transaction.create([{
        user: withdrawal.user,
        type: 'credit',
        amount: withdrawal.amount,
        description: `Withdrawal refund - ${withdrawal.failureReason}`,
        balanceAfter: updatedUser ? updatedUser.walletBalance : undefined,
        metadata: {
          withdrawalId: withdrawal._id,
          refundReason: withdrawal.failureReason
        }
      }], { session });

      console.log(`❌ Withdrawal ${withdrawalId} failed: ${withdrawal.failureReason}`);
    }

    await withdrawal.save({ session });
    await session.commitTransaction();

        try {
      await NotificationService.notifyWithdrawalProcessed(withdrawal, withdrawal.user);
    } catch (notifyError) {
      console.error('Failed to send withdrawal result notification:', notifyError);
    }

  } catch (error) {
    await session.abortTransaction();
    console.error('Withdrawal processing error:', error);
        try {
      const withdrawal = await Withdrawal.findById(withdrawalId);
      if (withdrawal) {
        await NotificationService.createNotification({
          userId: withdrawal.user,
          type: 'withdrawal_failed',
          title: 'Withdrawal Processing Error',
          message: 'There was an error processing your withdrawal. Our team has been notified.',
          data: {
            withdrawalId: withdrawal._id,
            amount: withdrawal.amount,
            metadata: {
              error: 'System error during processing'
            }
          },
          priority: 'high'
        });
      }
    } catch (notifyError) {
      console.error('Failed to send error notification:', notifyError);
    }
   
    // Mark as failed on error (best-effort)
    try {
      await Withdrawal.findByIdAndUpdate(withdrawalId, {
        status: 'failed',
        failureReason: 'System error during processing'
      });
    } catch (updateError) {
      console.error('Failed to update withdrawal status after error:', updateError);
    }
  } finally {
    session.endSession();
  }
};

// @desc    Get user withdrawal history
// @route   GET /api/wallet/withdrawals
// @access  Private
exports.getWithdrawalHistory = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const withdrawals = await Withdrawal.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: withdrawals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin commission earnings
// @route   GET /api/wallet/admin/commission
// @access  Private/Admin
exports.getAdminCommission = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access admin data'
      });
    }

    const objectUserId = toObjectId(userId) || userId;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalCommission, monthlyCommission, commissionByGig, recentCommissions] = await Promise.all([
      // Total commission
      Transaction.aggregate([
        {
          $match: {
            user: objectUserId,
            description: { $regex: /platform commission/i }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // Monthly commission
      Transaction.aggregate([
        {
          $match: {
            user: objectUserId,
            description: { $regex: /platform commission/i },
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // Commission by gig
      Transaction.aggregate([
        {
          $match: {
            user: objectUserId,
            description: { $regex: /platform commission/i }
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'gig',
            foreignField: '_id',
            as: 'gig'
          }
        },
        {
          $group: {
            _id: '$gig',
            totalCommission: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { totalCommission: -1 } },
        { $limit: 10 }
      ]),
      // Recent commissions
      Transaction.find({
        user: userId,
        description: { $regex: /platform commission/i }
      })
        .populate('gig', 'title budget user')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(20)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCommission: totalCommission[0]?.total || 0,
        monthlyCommission: monthlyCommission[0]?.total || 0,
        commissionByGig: commissionByGig,
        recentCommissions,
        adminWalletBalance: user.walletBalance,
        totalWithdrawalsProcessed: await Withdrawal.countDocuments({ status: 'completed' })
      }
    });
  } catch (error) {
    next(error);
  }
};
