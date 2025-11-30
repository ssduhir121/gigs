// // controllers/withdrawalController.js
// const mongoose = require('mongoose');
// const paypal = require('@paypal/checkout-server-sdk');
// const { client } = require('../utils/paypalClient');
// const Withdrawal = require('../models/Withdrawal');
// const User = require('../models/User');

// exports.createPayout = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { amount, userEmail, userName } = req.body;

//     if (!amount || parseFloat(amount) < 5) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Minimum withdrawal is $5.' });
//     }

//     const user = await User.findById(req.user.id).session(session);
//     if (!user || user.walletBalance < parseFloat(amount)) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Insufficient balance.' });
//     }

//     const withdrawAmount = parseFloat(amount);

//     // Deduct wallet first (prevents overspending in concurrent requests)
//     user.walletBalance = parseFloat((user.walletBalance - withdrawAmount).toFixed(2));
//     await user.save({ session });

//     // Create PayPal Payout request
//     const senderBatchId = `batch-${Date.now()}`;
//     const requestBody = {
//       sender_batch_header: {
//         sender_batch_id: senderBatchId,
//         email_subject: 'You have received a payment from GigShare Platform',
//       },
//       items: [
//         {
//           recipient_type: 'EMAIL',
//           amount: { value: withdrawAmount.toFixed(2), currency: 'USD' },
//           receiver: userEmail,
//           note: `Payout to ${userName}`,
//         },
//       ],
//     };

//     const request = new paypal.payouts.PayoutsPostRequest();
//     request.requestBody(requestBody);

//     const payoutResponse = await client().execute(request);
//     const batchHeader = payoutResponse.result.batch_header;

//     if (!batchHeader.payout_batch_id) {
//       await session.abortTransaction();
//       return res.status(500).json({ success: false, message: 'Failed to create payout batch.' });
//     }

//     // Create withdrawal record
//     const withdrawal = await Withdrawal.create(
//       [
//         {
//           user: req.user.id,
//           amount: withdrawAmount,
//           userEmail,
//           userName,
//           paymentMethod: 'paypal',
//           status: 'processing',
//           payoutBatchId: batchHeader.payout_batch_id,
//           payoutBatchStatus: batchHeader.batch_status,
//           initiatedAt: new Date(),
//         },
//       ],
//       { session }
//     );

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Payout initiated successfully.',
//       data: withdrawal[0],
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error('💥 PayPal payout error:', error);
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };



// controllers/withdrawalController.js
const mongoose = require('mongoose');
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../utils/paypalClient');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const NotificationService = require('../utils/notificationService');

exports.createPayout = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, userEmail, userName } = req.body;

    if (!amount || parseFloat(amount) < 5) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is $5.' });
    }

    const user = await User.findById(req.user.id).session(session);
    if (!user || user.walletBalance < parseFloat(amount)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    const withdrawAmount = parseFloat(amount);

    // Check if PayPal account is linked and verified
    if (!user.paypalEmail || !user.paypalVerified) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Please link and verify your PayPal account before withdrawing.' 
      });
    }

    // Verify the withdrawal email matches the linked PayPal email
    if (userEmail.toLowerCase() !== user.paypalEmail.toLowerCase()) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Withdrawal email must match your linked PayPal account.' 
      });
    }

    // Deduct wallet first (prevents overspending in concurrent requests)
    const previousBalance = user.walletBalance;
    user.walletBalance = parseFloat((user.walletBalance - withdrawAmount).toFixed(2));
    await user.save({ session });

    // Create transaction record for the withdrawal
    await Transaction.create([{
      user: req.user.id,
      type: 'debit',
      amount: withdrawAmount,
      description: `Withdrawal request to PayPal: ${userEmail}`,
      balanceAfter: user.walletBalance,
      metadata: {
        withdrawalType: 'paypal',
        paypalEmail: userEmail,
        previousBalance: previousBalance,
        newBalance: user.walletBalance
      }
    }], { session });

    // Create PayPal Payout request
    const senderBatchId = `batch-${Date.now()}`;
    const requestBody = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: 'You have received a payment from GigShare Platform',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: { value: withdrawAmount.toFixed(2), currency: 'USD' },
          receiver: userEmail,
          note: `Payout to ${userName}`,
        },
      ],
    };

    const request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody(requestBody);

    const payoutResponse = await client().execute(request);
    const batchHeader = payoutResponse.result.batch_header;

    if (!batchHeader.payout_batch_id) {
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: 'Failed to create payout batch.' });
    }

    // Create withdrawal record
    const withdrawal = await Withdrawal.create(
      [
        {
          user: req.user.id,
          amount: withdrawAmount,
          userEmail,
          userName,
          paymentMethod: 'paypal',
          status: 'processing',
          payoutBatchId: batchHeader.payout_batch_id,
          payoutBatchStatus: batchHeader.batch_status,
          initiatedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    // 🔔 NOTIFICATION: Withdrawal Requested Successfully
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'withdrawal_requested',
        title: 'Withdrawal Requested',
        message: `Your withdrawal of $${withdrawAmount.toFixed(2)} to ${userEmail} has been submitted and is being processed.`,
        data: {
          withdrawalId: withdrawal[0]._id,
          amount: withdrawAmount,
          paypalEmail: userEmail,
          payoutBatchId: batchHeader.payout_batch_id,
          metadata: {
            requestedAt: new Date(),
            amount: withdrawAmount.toFixed(2),
            previousBalance: previousBalance.toFixed(2),
            newBalance: user.walletBalance.toFixed(2)
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Withdrawal request notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Admin Notification for New Withdrawal
    try {
      const adminUsers = await User.find({ role: 'admin' });
      for (const admin of adminUsers) {
        await NotificationService.createNotification({
          userId: admin._id,
          type: 'withdrawal_requested',
          title: 'New Withdrawal Request',
          message: `User ${userName} requested a withdrawal of $${withdrawAmount.toFixed(2)} to ${userEmail}.`,
          data: {
            withdrawalId: withdrawal[0]._id,
            userId: req.user.id,
            userName: userName,
            amount: withdrawAmount,
            paypalEmail: userEmail,
            payoutBatchId: batchHeader.payout_batch_id,
            metadata: {
              requestedAt: new Date(),
              userEmail: user.email,
              userBalance: user.walletBalance.toFixed(2)
            }
          },
          priority: 'medium'
        });
      }
    } catch (notifyError) {
      console.error('Admin withdrawal notification failed:', notifyError);
    }

    console.log(`✅ Withdrawal initiated: $${withdrawAmount} to ${userEmail}`);

    res.status(200).json({
      success: true,
      message: 'Payout initiated successfully.',
      data: withdrawal[0],
    });
  } catch (error) {
    await session.abortTransaction();
    
    // 🔔 NOTIFICATION: Withdrawal Request Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'withdrawal_failed',
        title: 'Withdrawal Failed',
        message: `Your withdrawal request failed. Please try again. Error: ${error.message || 'Unknown error'}`,
        data: {
          amount: req.body.amount,
          paypalEmail: req.body.userEmail,
          error: error.message,
          metadata: {
            failedAt: new Date(),
            errorType: 'withdrawal_creation_failed'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Withdrawal failure notification failed:', notifyError);
    }
    
    console.error('💥 PayPal payout error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

// Get user withdrawal history
exports.getWithdrawalHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: req.user.id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const withdrawals = await Withdrawal.find(query)
      .sort({ initiatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments(query);

    // Get withdrawal stats
    const stats = await Withdrawal.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalWithdrawn: { $sum: '$amount' },
          totalWithdrawals: { $sum: 1 },
          pendingWithdrawals: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          },
          completedWithdrawals: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          failedWithdrawals: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      }
    ]);

    const withdrawalStats = stats[0] || {
      totalWithdrawn: 0,
      totalWithdrawals: 0,
      pendingWithdrawals: 0,
      completedWithdrawals: 0,
      failedWithdrawals: 0
    };

    res.status(200).json({
      success: true,
      data: withdrawals,
      stats: withdrawalStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get withdrawal by ID
exports.getWithdrawalById = async (req, res, next) => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findOne({
      _id: withdrawalId,
      user: req.user.id
    });

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    next(error);
  }
};

// Cancel withdrawal (if still processing)
exports.cancelWithdrawal = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findOne({
      _id: withdrawalId,
      user: req.user.id
    }).session(session);

    if (!withdrawal) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'processing') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel withdrawal with status: ${withdrawal.status}`
      });
    }

    // Refund amount to user's wallet
    const user = await User.findById(req.user.id).session(session);
    user.walletBalance = parseFloat((user.walletBalance + withdrawal.amount).toFixed(2));
    await user.save({ session });

    // Update withdrawal status
    withdrawal.status = 'cancelled';
    withdrawal.cancelledAt = new Date();
    withdrawal.cancellationReason = 'Cancelled by user';
    await withdrawal.save({ session });

    // Create refund transaction
    await Transaction.create([{
      user: req.user.id,
      type: 'credit',
      amount: withdrawal.amount,
      description: `Withdrawal cancellation refund: ${withdrawal.userEmail}`,
      balanceAfter: user.walletBalance,
      metadata: {
        withdrawalId: withdrawal._id,
        refundReason: 'Cancelled by user',
        originalAmount: withdrawal.amount,
        paypalEmail: withdrawal.userEmail
      }
    }], { session });

    await session.commitTransaction();

    // 🔔 NOTIFICATION: Withdrawal Cancelled
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Withdrawal Cancelled',
        message: `Your withdrawal of $${withdrawal.amount.toFixed(2)} has been cancelled and the amount has been refunded to your wallet.`,
        data: {
          withdrawalId: withdrawal._id,
          amount: withdrawal.amount,
          paypalEmail: withdrawal.userEmail,
          refundedAmount: withdrawal.amount,
          metadata: {
            cancelledAt: new Date(),
            newBalance: user.walletBalance.toFixed(2)
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Withdrawal cancellation notification failed:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: 'Withdrawal cancelled successfully',
      data: withdrawal
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get withdrawal eligibility and limits
exports.getWithdrawalInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const pendingWithdrawals = await Withdrawal.countDocuments({
      user: req.user.id,
      status: 'processing'
    });

    const withdrawalInfo = {
      walletBalance: user.walletBalance,
      paypalLinked: !!user.paypalEmail,
      paypalVerified: user.paypalVerified,
      paypalEmail: user.paypalEmail,
      withdrawalMethod: user.withdrawalMethod,
      minWithdrawal: 5,
      maxWithdrawal: user.walletBalance,
      pendingWithdrawals: pendingWithdrawals,
      canWithdraw: user.walletBalance >= 5 && user.paypalVerified,
      restrictions: {
        hasPaypal: !!user.paypalEmail,
        isVerified: user.paypalVerified,
        hasMinBalance: user.walletBalance >= 5,
        hasPendingWithdrawals: pendingWithdrawals > 0
      }
    };

    res.status(200).json({
      success: true,
      data: withdrawalInfo
    });
  } catch (error) {
    next(error);
  }
};