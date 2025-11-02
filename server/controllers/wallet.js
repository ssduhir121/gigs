// controllers/wallet.js
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get user wallet balance and transactions
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance name email');
    
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('gig', 'title')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        transactions
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalEarnings, monthlyEarnings, totalTransactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: req.user.id, type: 'credit' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { 
          $match: { 
            user: req.user.id, 
            type: 'credit',
            createdAt: { $gte: thirtyDaysAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.countDocuments({ user: req.user.id })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings[0]?.total || 0,
        totalTransactions: totalTransactions || 0
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
  session.startTransaction();

  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid withdrawal amount'
      });
    }

    const user = await User.findById(req.user.id).session(session);
    
    if (user.walletBalance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance in your wallet'
      });
    }

    // Update user wallet balance
    user.walletBalance -= amount;
    await user.save({ session });

    // Create withdrawal transaction record
    await Transaction.create([{
      user: req.user.id,
      type: 'debit',
      amount: amount,
      description: 'Wallet withdrawal',
      balanceAfter: user.walletBalance
    }], { session });

    await session.commitTransaction();

    // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
    // to actually send the money to the user

    res.status(200).json({
      success: true,
      message: 'Withdrawal request processed successfully',
      newBalance: user.walletBalance
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};