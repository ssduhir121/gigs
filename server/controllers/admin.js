// // controllers/admin.js
// const User = require('../models/User');
// const Gig = require('../models/Gig');
// const Share = require('../models/Share');
// const Transaction = require('../models/Transaction');
// const Withdrawal = require('../models/Withdrawal');

// // @desc    Get admin stats
// // @route   GET /api/admin/stats
// // @access  Private/Admin
// exports.getStats = async (req, res, next) => {
//   try {
//     const [
//       totalUsers,
//       totalGigs,
//       totalShares,
//       adminUser,
//       pendingWithdrawals,
//       totalCommission
//     ] = await Promise.all([
//       User.countDocuments(),
//       Gig.countDocuments(),
//       Share.countDocuments(),
//       User.findOne({ role: 'admin' }),
//       Withdrawal.countDocuments({ status: { $in: ['pending', 'processing'] } }),
//       Transaction.aggregate([
//         { 
//           $match: { 
//             description: { $regex: /platform commission/i }
//           } 
//         },
//         { $group: { _id: null, total: { $sum: '$amount' } } }
//       ])
//     ]);

//     // Calculate total platform revenue
//     const revenueResult = await Share.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: '$platformFee' }
//         }
//       }
//     ]);

//     const totalRevenue = revenueResult[0]?.totalRevenue || 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalUsers,
//         totalGigs,
//         totalShares,
//         totalRevenue,
//         totalCommission: totalCommission[0]?.total || 0,
//         adminBalance: adminUser?.walletBalance || 0,
//         pendingWithdrawals,
//         platformEarnings: adminUser?.walletBalance || 0
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// // Other admin controller methods remain the same...
// exports.getUsers = async (req, res, next) => {
//   try {
//     const users = await User.find().select('-password').sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: users.length,
//       data: users
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getGigs = async (req, res, next) => {
//   try {
//     const gigs = await Gig.find()
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: gigs.length,
//       data: gigs
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getShares = async (req, res, next) => {
//   try {
//     const shares = await Share.find()
//       .populate('user', 'name email')
//       .populate('gig', 'title budget')
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: shares.length,
//       data: shares
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// controllers/admin.js
const User = require('../models/User');
const Company = require("../models/Company")
const Gig = require('../models/Gig');
const Share = require('../models/Share');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const mongoose = require('mongoose');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
// Update the getStats method to include company data
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalGigs,
      totalShares,
      adminUser,
      pendingWithdrawals,
      totalCommission,
      activeGigs,
      completedGigs,
      totalCompanies, // ✅ ADD: Company counts
      verifiedCompanies,
      pendingCompanies
    ] = await Promise.all([
      User.countDocuments(),
      Gig.countDocuments(),
      Share.countDocuments(),
      User.findOne({ role: 'admin' }),
      Withdrawal.countDocuments({ status: { $in: ['pending', 'processing'] } }),
      Transaction.aggregate([
        { 
          $match: { 
            description: { $regex: /platform commission/i }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Gig.countDocuments({ isActive: true }),
      Gig.countDocuments({ isActive: false }),
      Company.countDocuments(), // ✅ ADD
      Company.countDocuments({ verificationStatus: 'verified' }), // ✅ ADD
      Company.countDocuments({ verificationStatus: 'pending' }) // ✅ ADD
    ]);

    // Calculate total platform revenue
    const revenueResult = await Share.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$platformFee' }
        }
      }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalGigs,
        totalShares,
        totalRevenue,
        totalCommission: totalCommission[0]?.total || 0,
        adminBalance: adminUser?.walletBalance || 0,
        pendingWithdrawals,
        platformEarnings: adminUser?.walletBalance || 0,
        activeGigs,
        completedGigs,
        totalCompanies, // ✅ ADD: Company stats
        verifiedCompanies,
        pendingCompanies
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and filtering
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { search = '', role = '', page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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

// @desc    Update user role
// @route   PUT /api/admin/users/:userId/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'moderator', 'admin'].includes(role)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, moderator, or admin'
      });
    }

    // Prevent self-demotion
    if (userId === req.user.id && role !== 'admin') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role from admin'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, session }
    ).select('-password');

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get pending withdrawals
// @route   GET /api/admin/pending-withdrawals
// @access  Private/Admin
exports.getPendingWithdrawals = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const withdrawals = await Withdrawal.find({
      status: { $in: ['pending', 'processing'] }
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Withdrawal.countDocuments({
      status: { $in: ['pending', 'processing'] }
    });

    res.status(200).json({
      success: true,
      data: withdrawals,
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

// @desc    Approve withdrawal
// @route   POST /api/admin/withdrawals/:withdrawalId/approve
// @access  Private/Admin
exports.approveWithdrawal = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findById(withdrawalId).session(session);

    if (!withdrawal) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Withdrawal is already ${withdrawal.status}`
      });
    }

    // Update withdrawal status
    withdrawal.status = 'processing';
    withdrawal.processedBy = req.user.id;
    withdrawal.processedAt = new Date();
    await withdrawal.save({ session });

    // In production, you would integrate with PayPal Payouts API here
    // For now, we'll simulate successful processing
    console.log(`💰 Processing withdrawal ${withdrawalId} for $${withdrawal.amount} to ${withdrawal.userEmail}`);

    // Simulate PayPal Payouts API call
    const payoutSuccess = true; // Replace with actual PayPal API call

    if (payoutSuccess) {
      withdrawal.status = 'completed';
      withdrawal.payoutBatchId = `BATCH_${Date.now()}`;
      await withdrawal.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Withdrawal approved and processed successfully',
        data: withdrawal
      });
    } else {
      // If payout fails, mark as failed and refund
      withdrawal.status = 'failed';
      withdrawal.failureReason = 'Payment processor rejected the payout';
      await withdrawal.save({ session });

      // Refund amount to user's wallet
      await User.findByIdAndUpdate(
        withdrawal.user,
        { $inc: { walletBalance: withdrawal.amount } },
        { session }
      );

      await session.commitTransaction();

      res.status(400).json({
        success: false,
        message: 'Withdrawal processing failed. Amount refunded to user wallet.',
        data: withdrawal
      });
    }
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Reject withdrawal
// @route   POST /api/admin/withdrawals/:withdrawalId/reject
// @access  Private/Admin
exports.rejectWithdrawal = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { withdrawalId } = req.params;
    const { reason = 'Withdrawal request rejected by admin' } = req.body;

    const withdrawal = await Withdrawal.findById(withdrawalId).session(session);

    if (!withdrawal) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    if (withdrawal.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot reject withdrawal with status: ${withdrawal.status}`
      });
    }

    // Update withdrawal status
    withdrawal.status = 'failed';
    withdrawal.failureReason = reason;
    withdrawal.processedBy = req.user.id;
    withdrawal.processedAt = new Date();
    await withdrawal.save({ session });

    // Refund amount to user's wallet
    await User.findByIdAndUpdate(
      withdrawal.user,
      { $inc: { walletBalance: withdrawal.amount } },
      { session }
    );

    // Create refund transaction
    const user = await User.findById(withdrawal.user).session(session);
    await Transaction.create([{
      user: withdrawal.user,
      type: 'credit',
      amount: withdrawal.amount,
      description: `Withdrawal refund: ${reason}`,
      balanceAfter: user.walletBalance + withdrawal.amount,
      metadata: {
        withdrawalId: withdrawal._id,
        refundReason: reason,
        processedBy: req.user.id
      }
    }], { session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Withdrawal rejected and amount refunded',
      data: withdrawal
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get platform earnings
// @route   GET /api/admin/platform-earnings
// @access  Private/Admin
exports.getPlatformEarnings = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalEarnings,
      monthlyEarnings,
      earningsBySource,
      recentCommissions
    ] = await Promise.all([
      // Total platform earnings
      Transaction.aggregate([
        {
          $match: {
            description: { $regex: /platform commission/i }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      // Monthly earnings
      Transaction.aggregate([
        {
          $match: {
            description: { $regex: /platform commission/i },
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]),
      // Earnings by gig type
      Transaction.aggregate([
        {
          $match: {
            description: { $regex: /platform commission/i }
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'gig',
            foreignField: '_id',
            as: 'gigData'
          }
        },
        {
          $group: {
            _id: { $arrayElemAt: ['$gigData.contentType', 0] },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { total: -1 } }
      ]),
      // Recent commissions
      Transaction.find({
        description: { $regex: /platform commission/i }
      })
        .populate('gig', 'title budget contentType')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings[0]?.total || 0,
        earningsBySource,
        recentCommissions
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get flagged gigs for moderation
// @route   GET /api/admin/flagged-gigs
// @access  Private/Admin
exports.getFlaggedGigs = async (req, res, next) => {
  try {
    // For now, return recent gigs that might need moderation
    // In production, you'd have a flagging system
    const gigs = await Gig.find({
      isActive: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    // Add mock flag reasons for demonstration
    const flaggedGigs = gigs.map(gig => ({
      ...gig.toObject(),
      flagReason: Math.random() > 0.7 ? 'Potential policy violation' : 
                 Math.random() > 0.5 ? 'User reported content' : 
                 'Awaiting review'
    }));

    res.status(200).json({
      success: true,
      data: flaggedGigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve gig
// @route   POST /api/admin/gigs/:gigId/approve
// @access  Private/Admin
exports.approveGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { 
        isActive: true,
        $unset: { flagReason: 1 } // Remove flag reason if exists
      },
      { new: true }
    ).populate('user', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gig approved successfully',
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject gig
// @route   POST /api/admin/gigs/:gigId/reject
// @access  Private/Admin
exports.rejectGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const { reason = 'Content violates platform policies' } = req.body;

    const gig = await Gig.findByIdAndUpdate(
      gigId,
      { 
        isActive: false,
        flagReason: reason
      },
      { new: true }
    ).populate('user', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // TODO: Notify user about gig rejection
    // TODO: Process refund if payment was made

    res.status(200).json({
      success: true,
      message: 'Gig rejected successfully',
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gigs
// @route   GET /api/admin/gigs
// @access  Private/Admin
exports.getGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shares
// @route   GET /api/admin/shares
// @access  Private/Admin
exports.getShares = async (req, res, next) => {
  try {
    const shares = await Share.find()
      .populate('user', 'name email')
      .populate('gig', 'title budget')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shares.length,
      data: shares
    });
  } catch (error) {
    next(error);
  }
};


// Add these methods to your controllers/admin.js

// @desc    Get top sharers analytics
// @route   GET /api/admin/analytics/top-sharers
// @access  Private/Admin
exports.getTopSharers = async (req, res, next) => {
  try {
    const { period = 'all', limit = 10 } = req.query;
    
    // Date range based on period
    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const topSharers = await Share.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$user',
          totalShares: { $sum: 1 },
          approvedShares: {
            $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
          },
          totalEarnings: { $sum: '$amountEarned' },
          totalClicks: { $sum: '$totalClicks' },
          uniqueClicks: { $sum: '$uniqueClicks' },
          lastShareDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          totalShares: 1,
          approvedShares: 1,
          pendingShares: { $subtract: ['$totalShares', '$approvedShares'] },
          totalEarnings: 1,
          totalClicks: 1,
          uniqueClicks: 1,
          clickThroughRate: {
            $cond: [
              { $gt: ['$totalClicks', 0] },
              { $multiply: [{ $divide: ['$uniqueClicks', '$totalClicks'] }, 100] },
              0
            ]
          },
          lastShareDate: 1
        }
      },
      { $sort: { totalShares: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: topSharers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top gig creators analytics
// @route   GET /api/admin/analytics/top-creators
// @access  Private/Admin
exports.getTopCreators = async (req, res, next) => {
  try {
    const { period = 'all', limit = 10 } = req.query;
    
    // Date range based on period
    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const topCreators = await Gig.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$user',
          totalGigs: { $sum: 1 },
          activeGigs: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          completedGigs: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          },
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: '$availableFunds' },
          totalSharesCompleted: { $sum: '$sharesCompleted' },
          totalClicks: { $sum: '$totalClicks' },
          lastGigDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          totalGigs: 1,
          activeGigs: 1,
          completedGigs: 1,
          totalBudget: 1,
          totalSpent: 1,
          platformRevenue: { $subtract: ['$totalBudget', '$totalSpent'] },
          totalSharesCompleted: 1,
          totalClicks: 1,
          avgCompletionRate: {
            $cond: [
              { $gt: ['$totalGigs', 0] },
              { $multiply: [{ $divide: ['$completedGigs', '$totalGigs'] }, 100] },
              0
            ]
          },
          lastGigDate: 1
        }
      },
      { $sort: { totalGigs: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: topCreators
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gig performance analytics
// @route   GET /api/admin/analytics/gig-performance
// @access  Private/Admin
exports.getGigPerformance = async (req, res, next) => {
  try {
    const { period = 'all', limit = 20 } = req.query;
    
    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const gigPerformance = await Gig.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      {
        $lookup: {
          from: 'shares',
          localField: '_id',
          foreignField: 'gig',
          as: 'shares'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          budget: 1,
          contentType: 1,
          isActive: 1,
          sharesRequired: 1,
          sharesCompleted: 1,
          totalClicks: 1,
          availableFunds: 1,
          platformFee: 1,
          createdAt: 1,
          creatorName: '$creator.name',
          creatorEmail: '$creator.email',
          totalShares: { $size: '$shares' },
          approvedShares: {
            $size: {
              $filter: {
                input: '$shares',
                as: 'share',
                cond: { $eq: ['$$share.submissionStatus', 'approved'] }
              }
            }
          },
          completionRate: {
            $multiply: [{ $divide: ['$sharesCompleted', '$sharesRequired'] }, 100]
          },
          costPerShare: {
            $cond: [
              { $gt: ['$sharesCompleted', 0] },
              { $divide: [{ $subtract: ['$budget', '$availableFunds'] }, '$sharesCompleted'] },
              0
            ]
          }
        }
      },
      { $sort: { totalClicks: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.status(200).json({
      success: true,
      data: gigPerformance
    });
  } catch (error) {
    next(error);
  }
};


// ✅ ADD: Company Management Controllers

// @desc    Get all companies
// @route   GET /api/admin/companies
// @access  Private/Admin
exports.getCompanies = async (req, res, next) => {
  try {
    const { search = '', status = '', page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { businessEmail: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.verificationStatus = status;
    }

    const companies = await Company.find(query)
      .populate('teamMembers.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(query);

    res.status(200).json({
      success: true,
      data: companies,
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

// @desc    Get pending companies for verification
// @route   GET /api/admin/companies/pending
// @access  Private/Admin
exports.getPendingCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const companies = await Company.find({
      verificationStatus: 'pending'
    })
      .populate('teamMembers.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Company.countDocuments({ verificationStatus: 'pending' });

    res.status(200).json({
      success: true,
      data: companies,
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

// @desc    Verify a company
// @route   POST /api/admin/companies/:companyId/verify
// @access  Private/Admin
exports.verifyCompany = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId).session(session);

    if (!company) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.verificationStatus !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Company is already ${company.verificationStatus}`
      });
    }

    // Update company status
    company.verificationStatus = 'verified';
    company.verifiedAt = new Date();
    company.verifiedBy = req.user.id;
    await company.save({ session });

    // Update all team members to active status
    company.teamMembers.forEach(member => {
      member.status = 'active';
    });
    await company.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Company verified successfully',
      data: company
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Reject a company
// @route   POST /api/admin/companies/:companyId/reject
// @access  Private/Admin
exports.rejectCompany = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { companyId } = req.params;
    const { reason = 'Company registration rejected by admin' } = req.body;

    const company = await Company.findById(companyId).session(session);

    if (!company) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.verificationStatus !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Company is already ${company.verificationStatus}`
      });
    }

    // Update company status
    company.verificationStatus = 'rejected';
    company.rejectionReason = reason;
    company.rejectedAt = new Date();
    company.rejectedBy = req.user.id;
    await company.save({ session });

    // Remove company references from users
    const teamUserIds = company.teamMembers.map(member => member.user);
    await User.updateMany(
      { _id: { $in: teamUserIds } },
      { 
        $unset: { 
          company: 1,
          companyRole: 1
        }
      },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Company rejected successfully',
      data: company
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Update company status
// @route   PUT /api/admin/companies/:companyId/status
// @access  Private/Admin
exports.updateCompanyStatus = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { companyId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, verified, or rejected'
      });
    }

    const company = await Company.findById(companyId).session(session);

    if (!company) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update company status
    company.verificationStatus = status;
    
    // Set timestamps based on status
    if (status === 'verified') {
      company.verifiedAt = new Date();
      company.verifiedBy = req.user.id;
      company.rejectionReason = undefined;
      
      // Activate all team members
      company.teamMembers.forEach(member => {
        member.status = 'active';
      });
    } else if (status === 'rejected') {
      company.rejectedAt = new Date();
      company.rejectedBy = req.user.id;
      
      // Remove company references from users if rejecting
      const teamUserIds = company.teamMembers.map(member => member.user);
      await User.updateMany(
        { _id: { $in: teamUserIds } },
        { 
          $unset: { 
            company: 1,
            companyRole: 1
          }
        },
        { session }
      );
    }

    await company.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `Company status updated to ${status}`,
      data: company
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get company statistics
// @route   GET /api/admin/companies/stats
// @access  Private/Admin
exports.getCompanyStats = async (req, res, next) => {
  try {
    const [
      totalCompanies,
      verifiedCompanies,
      pendingCompanies,
      rejectedCompanies,
      companiesByIndustry,
      companiesBySize
    ] = await Promise.all([
      Company.countDocuments(),
      Company.countDocuments({ verificationStatus: 'verified' }),
      Company.countDocuments({ verificationStatus: 'pending' }),
      Company.countDocuments({ verificationStatus: 'rejected' }),
      Company.aggregate([
        {
          $group: {
            _id: '$industry',
            count: { $sum: 1 },
            verified: {
              $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Company.aggregate([
        {
          $group: {
            _id: '$companySize',
            count: { $sum: 1 },
            verified: {
              $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] }
            }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCompanies,
        verifiedCompanies,
        pendingCompanies,
        rejectedCompanies,
        companiesByIndustry,
        companiesBySize
      }
    });
  } catch (error) {
    next(error);
  }
};