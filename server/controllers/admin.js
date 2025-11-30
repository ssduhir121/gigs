
// // controllers/admin.js
// const User = require('../models/User');
// const Company = require("../models/Company")
// const Gig = require('../models/Gig');
// const Share = require('../models/Share');
// const Transaction = require('../models/Transaction');
// const Withdrawal = require('../models/Withdrawal');
// const Application = require('../models/Application');
// const Invitation = require('../models/Invitation'); // ADD: Import Invitation model
// const crypto = require('crypto');
// const mongoose = require('mongoose');

// // @desc    Get admin stats
// // @route   GET /api/admin/stats
// // @access  Private/Admin
// // Update the getStats method to include company data
// exports.getStats = async (req, res, next) => {
//   try {
//     const [
//       totalUsers,
//       totalGigs,
//       totalShares,
//       adminUser,
//       pendingWithdrawals,
//       totalCommission,
//       activeGigs,
//       completedGigs,
//       totalCompanies, // ✅ ADD: Company counts
//       verifiedCompanies,
//       pendingCompanies,
//       pendingInvitations // ADD: Invitation counts
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
//       ]),
//       Gig.countDocuments({ isActive: true }),
//       Gig.countDocuments({ isActive: false }),
//       Company.countDocuments(), // ✅ ADD
//       Company.countDocuments({ verificationStatus: 'verified' }), // ✅ ADD
//       Company.countDocuments({ verificationStatus: 'pending' }), // ✅ ADD
//       Invitation.countDocuments({ status: 'pending' }) // ADD: Pending invitations
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
//         platformEarnings: adminUser?.walletBalance || 0,
//         activeGigs,
//         completedGigs,
//         totalCompanies, // ✅ ADD: Company stats
//         verifiedCompanies,
//         pendingCompanies,
//         pendingInvitations // ADD: Invitation stats
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all users with search and filtering
// // @route   GET /api/admin/users
// // @access  Private/Admin
// exports.getUsers = async (req, res, next) => {
//   try {
//     const { search = '', role = '', page = 1, limit = 50 } = req.query;
//     const skip = (page - 1) * limit;

//     // Build query
//     let query = {};
    
//     // Search filter
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Role filter
//     if (role && role !== 'all') {
//       query.role = role;
//     }

//     const users = await User.find(query)
//       .select('-password')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await User.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: users,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update user role
// // @route   PUT /api/admin/users/:userId/role
// // @access  Private/Admin
// exports.updateUserRole = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { userId } = req.params;
//     const { role } = req.body;

//     // Validate role
//     if (!['user', 'moderator', 'admin'].includes(role)) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid role. Must be user, moderator, or admin'
//       });
//     }

//     // Prevent self-demotion
//     if (userId === req.user.id && role !== 'admin') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change your own role from admin'
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { role },
//       { new: true, session }
//     ).select('-password');

//     if (!user) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: `User role updated to ${role}`,
//       data: user
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get pending withdrawals
// // @route   GET /api/admin/pending-withdrawals
// // @access  Private/Admin
// exports.getPendingWithdrawals = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;
//     const skip = (page - 1) * limit;

//     const withdrawals = await Withdrawal.find({
//       status: { $in: ['pending', 'processing'] }
//     })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Withdrawal.countDocuments({
//       status: { $in: ['pending', 'processing'] }
//     });

//     res.status(200).json({
//       success: true,
//       data: withdrawals,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Approve withdrawal
// // @route   POST /api/admin/withdrawals/:withdrawalId/approve
// // @access  Private/Admin
// exports.approveWithdrawal = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { withdrawalId } = req.params;

//     const withdrawal = await Withdrawal.findById(withdrawalId).session(session);

//     if (!withdrawal) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Withdrawal not found'
//       });
//     }

//     if (withdrawal.status !== 'pending') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Withdrawal is already ${withdrawal.status}`
//       });
//     }

//     // Update withdrawal status
//     withdrawal.status = 'processing';
//     withdrawal.processedBy = req.user.id;
//     withdrawal.processedAt = new Date();
//     await withdrawal.save({ session });

//     // In production, you would integrate with PayPal Payouts API here
//     // For now, we'll simulate successful processing
//     console.log(`💰 Processing withdrawal ${withdrawalId} for $${withdrawal.amount} to ${withdrawal.userEmail}`);

//     // Simulate PayPal Payouts API call
//     const payoutSuccess = true; // Replace with actual PayPal API call

//     if (payoutSuccess) {
//       withdrawal.status = 'completed';
//       withdrawal.payoutBatchId = `BATCH_${Date.now()}`;
//       await withdrawal.save({ session });

//       await session.commitTransaction();

//       res.status(200).json({
//         success: true,
//         message: 'Withdrawal approved and processed successfully',
//         data: withdrawal
//       });
//     } else {
//       // If payout fails, mark as failed and refund
//       withdrawal.status = 'failed';
//       withdrawal.failureReason = 'Payment processor rejected the payout';
//       await withdrawal.save({ session });

//       // Refund amount to user's wallet
//       await User.findByIdAndUpdate(
//         withdrawal.user,
//         { $inc: { walletBalance: withdrawal.amount } },
//         { session }
//       );

//       await session.commitTransaction();

//       res.status(400).json({
//         success: false,
//         message: 'Withdrawal processing failed. Amount refunded to user wallet.',
//         data: withdrawal
//       });
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Reject withdrawal
// // @route   POST /api/admin/withdrawals/:withdrawalId/reject
// // @access  Private/Admin
// exports.rejectWithdrawal = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { withdrawalId } = req.params;
//     const { reason = 'Withdrawal request rejected by admin' } = req.body;

//     const withdrawal = await Withdrawal.findById(withdrawalId).session(session);

//     if (!withdrawal) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Withdrawal not found'
//       });
//     }

//     if (withdrawal.status !== 'pending') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Cannot reject withdrawal with status: ${withdrawal.status}`
//       });
//     }

//     // Update withdrawal status
//     withdrawal.status = 'failed';
//     withdrawal.failureReason = reason;
//     withdrawal.processedBy = req.user.id;
//     withdrawal.processedAt = new Date();
//     await withdrawal.save({ session });

//     // Refund amount to user's wallet
//     await User.findByIdAndUpdate(
//       withdrawal.user,
//       { $inc: { walletBalance: withdrawal.amount } },
//       { session }
//     );

//     // Create refund transaction
//     const user = await User.findById(withdrawal.user).session(session);
//     await Transaction.create([{
//       user: withdrawal.user,
//       type: 'credit',
//       amount: withdrawal.amount,
//       description: `Withdrawal refund: ${reason}`,
//       balanceAfter: user.walletBalance + withdrawal.amount,
//       metadata: {
//         withdrawalId: withdrawal._id,
//         refundReason: reason,
//         processedBy: req.user.id
//       }
//     }], { session });

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Withdrawal rejected and amount refunded',
//       data: withdrawal
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get platform earnings
// // @route   GET /api/admin/platform-earnings
// // @access  Private/Admin
// exports.getPlatformEarnings = async (req, res, next) => {
//   try {
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const [
//       totalEarnings,
//       monthlyEarnings,
//       earningsBySource,
//       recentCommissions
//     ] = await Promise.all([
//       // Total platform earnings
//       Transaction.aggregate([
//         {
//           $match: {
//             description: { $regex: /platform commission/i }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: '$amount' }
//           }
//         }
//       ]),
//       // Monthly earnings
//       Transaction.aggregate([
//         {
//           $match: {
//             description: { $regex: /platform commission/i },
//             createdAt: { $gte: thirtyDaysAgo }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: '$amount' }
//           }
//         }
//       ]),
//       // Earnings by gig type
//       Transaction.aggregate([
//         {
//           $match: {
//             description: { $regex: /platform commission/i }
//           }
//         },
//         {
//           $lookup: {
//             from: 'gigs',
//             localField: 'gig',
//             foreignField: '_id',
//             as: 'gigData'
//           }
//         },
//         {
//           $group: {
//             _id: { $arrayElemAt: ['$gigData.contentType', 0] },
//             total: { $sum: '$amount' },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { total: -1 } }
//       ]),
//       // Recent commissions
//       Transaction.find({
//         description: { $regex: /platform commission/i }
//       })
//         .populate('gig', 'title budget contentType')
//         .populate('user', 'name email')
//         .sort({ createdAt: -1 })
//         .limit(10)
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         totalEarnings: totalEarnings[0]?.total || 0,
//         monthlyEarnings: monthlyEarnings[0]?.total || 0,
//         earningsBySource,
//         recentCommissions
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get flagged gigs for moderation
// // @route   GET /api/admin/flagged-gigs
// // @access  Private/Admin
// exports.getFlaggedGigs = async (req, res, next) => {
//   try {
//     // For now, return recent gigs that might need moderation
//     // In production, you'd have a flagging system
//     const gigs = await Gig.find({
//       isActive: true,
//       createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
//     })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//       .limit(20);

//     // Add mock flag reasons for demonstration
//     const flaggedGigs = gigs.map(gig => ({
//       ...gig.toObject(),
//       flagReason: Math.random() > 0.7 ? 'Potential policy violation' : 
//                  Math.random() > 0.5 ? 'User reported content' : 
//                  'Awaiting review'
//     }));

//     res.status(200).json({
//       success: true,
//       data: flaggedGigs
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Approve gig
// // @route   POST /api/admin/gigs/:gigId/approve
// // @access  Private/Admin
// exports.approveGig = async (req, res, next) => {
//   try {
//     const { gigId } = req.params;

//     const gig = await Gig.findByIdAndUpdate(
//       gigId,
//       { 
//         isActive: true,
//         $unset: { flagReason: 1 } // Remove flag reason if exists
//       },
//       { new: true }
//     ).populate('user', 'name email');

//     if (!gig) {
//       return res.status(404).json({
//         success: false,
//         message: 'Gig not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Gig approved successfully',
//       data: gig
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Reject gig
// // @route   POST /api/admin/gigs/:gigId/reject
// // @access  Private/Admin
// exports.rejectGig = async (req, res, next) => {
//   try {
//     const { gigId } = req.params;
//     const { reason = 'Content violates platform policies' } = req.body;

//     const gig = await Gig.findByIdAndUpdate(
//       gigId,
//       { 
//         isActive: false,
//         flagReason: reason
//       },
//       { new: true }
//     ).populate('user', 'name email');

//     if (!gig) {
//       return res.status(404).json({
//         success: false,
//         message: 'Gig not found'
//       });
//     }

//     // TODO: Notify user about gig rejection
//     // TODO: Process refund if payment was made

//     res.status(200).json({
//       success: true,
//       message: 'Gig rejected successfully',
//       data: gig
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all gigs
// // @route   GET /api/admin/gigs
// // @access  Private/Admin
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

// // @desc    Get all shares
// // @route   GET /api/admin/shares
// // @access  Private/Admin
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

// // Add these methods to your controllers/admin.js

// // @desc    Get top sharers analytics
// // @route   GET /api/admin/analytics/top-sharers
// // @access  Private/Admin
// exports.getTopSharers = async (req, res, next) => {
//   try {
//     const { period = 'all', limit = 10 } = req.query;
    
//     // Date range based on period
//     let dateFilter = {};
//     if (period === 'week') {
//       dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
//     } else if (period === 'month') {
//       dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
//     }

//     const topSharers = await Share.aggregate([
//       { $match: dateFilter },
//       {
//         $group: {
//           _id: '$user',
//           totalShares: { $sum: 1 },
//           approvedShares: {
//             $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
//           },
//           totalEarnings: { $sum: '$amountEarned' },
//           totalClicks: { $sum: '$totalClicks' },
//           uniqueClicks: { $sum: '$uniqueClicks' },
//           lastShareDate: { $max: '$createdAt' }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           userName: '$user.name',
//           userEmail: '$user.email',
//           totalShares: 1,
//           approvedShares: 1,
//           pendingShares: { $subtract: ['$totalShares', '$approvedShares'] },
//           totalEarnings: 1,
//           totalClicks: 1,
//           uniqueClicks: 1,
//           clickThroughRate: {
//             $cond: [
//               { $gt: ['$totalClicks', 0] },
//               { $multiply: [{ $divide: ['$uniqueClicks', '$totalClicks'] }, 100] },
//               0
//             ]
//           },
//           lastShareDate: 1
//         }
//       },
//       { $sort: { totalShares: -1 } },
//       { $limit: parseInt(limit) }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: topSharers
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get top gig creators analytics
// // @route   GET /api/admin/analytics/top-creators
// // @access  Private/Admin
// exports.getTopCreators = async (req, res, next) => {
//   try {
//     const { period = 'all', limit = 10 } = req.query;
    
//     // Date range based on period
//     let dateFilter = {};
//     if (period === 'week') {
//       dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
//     } else if (period === 'month') {
//       dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
//     }

//     const topCreators = await Gig.aggregate([
//       { $match: dateFilter },
//       {
//         $group: {
//           _id: '$user',
//           totalGigs: { $sum: 1 },
//           activeGigs: {
//             $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
//           },
//           completedGigs: {
//             $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
//           },
//           totalBudget: { $sum: '$budget' },
//           totalSpent: { $sum: '$availableFunds' },
//           totalSharesCompleted: { $sum: '$sharesCompleted' },
//           totalClicks: { $sum: '$totalClicks' },
//           lastGigDate: { $max: '$createdAt' }
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           userName: '$user.name',
//           userEmail: '$user.email',
//           totalGigs: 1,
//           activeGigs: 1,
//           completedGigs: 1,
//           totalBudget: 1,
//           totalSpent: 1,
//           platformRevenue: { $subtract: ['$totalBudget', '$totalSpent'] },
//           totalSharesCompleted: 1,
//           totalClicks: 1,
//           avgCompletionRate: {
//             $cond: [
//               { $gt: ['$totalGigs', 0] },
//               { $multiply: [{ $divide: ['$completedGigs', '$totalGigs'] }, 100] },
//               0
//             ]
//           },
//           lastGigDate: 1
//         }
//       },
//       { $sort: { totalGigs: -1 } },
//       { $limit: parseInt(limit) }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: topCreators
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get gig performance analytics
// // @route   GET /api/admin/analytics/gig-performance
// // @access  Private/Admin
// exports.getGigPerformance = async (req, res, next) => {
//   try {
//     const { period = 'all', limit = 20 } = req.query;
    
//     let dateFilter = {};
//     if (period === 'week') {
//       dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
//     } else if (period === 'month') {
//       dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
//     }

//     const gigPerformance = await Gig.aggregate([
//       { $match: dateFilter },
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'user',
//           foreignField: '_id',
//           as: 'creator'
//         }
//       },
//       { $unwind: '$creator' },
//       {
//         $lookup: {
//           from: 'shares',
//           localField: '_id',
//           foreignField: 'gig',
//           as: 'shares'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           budget: 1,
//           contentType: 1,
//           isActive: 1,
//           sharesRequired: 1,
//           sharesCompleted: 1,
//           totalClicks: 1,
//           availableFunds: 1,
//           platformFee: 1,
//           createdAt: 1,
//           creatorName: '$creator.name',
//           creatorEmail: '$creator.email',
//           totalShares: { $size: '$shares' },
//           approvedShares: {
//             $size: {
//               $filter: {
//                 input: '$shares',
//                 as: 'share',
//                 cond: { $eq: ['$$share.submissionStatus', 'approved'] }
//               }
//             }
//           },
//           completionRate: {
//             $multiply: [{ $divide: ['$sharesCompleted', '$sharesRequired'] }, 100]
//           },
//           costPerShare: {
//             $cond: [
//               { $gt: ['$sharesCompleted', 0] },
//               { $divide: [{ $subtract: ['$budget', '$availableFunds'] }, '$sharesCompleted'] },
//               0
//             ]
//           }
//         }
//       },
//       { $sort: { totalClicks: -1 } },
//       { $limit: parseInt(limit) }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: gigPerformance
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // ✅ ADD: Company Management Controllers

// // @desc    Get all companies
// // @route   GET /api/admin/companies
// // @access  Private/Admin
// exports.getCompanies = async (req, res, next) => {
//   try {
//     const { search = '', status = '', page = 1, limit = 50 } = req.query;
//     const skip = (page - 1) * limit;

//     // Build query
//     let query = {};
    
//     // Search filter
//     if (search) {
//       query.$or = [
//         { companyName: { $regex: search, $options: 'i' } },
//         { businessEmail: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Status filter
//     if (status && status !== 'all') {
//       query.verificationStatus = status;
//     }

//     const companies = await Company.find(query)
//       .populate('teamMembers.user', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Company.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: companies,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get pending companies for verification
// // @route   GET /api/admin/companies/pending
// // @access  Private/Admin
// exports.getPendingCompanies = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 20 } = req.query;
//     const skip = (page - 1) * limit;

//     const companies = await Company.find({
//       verificationStatus: 'pending'
//     })
//       .populate('teamMembers.user', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Company.countDocuments({ verificationStatus: 'pending' });

//     res.status(200).json({
//       success: true,
//       data: companies,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Verify a company
// // @route   POST /api/admin/companies/:companyId/verify
// // @access  Private/Admin
// exports.verifyCompany = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { companyId } = req.params;

//     const company = await Company.findById(companyId).session(session);

//     if (!company) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     if (company.verificationStatus !== 'pending') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Company is already ${company.verificationStatus}`
//       });
//     }

//     // Update company status
//     company.verificationStatus = 'verified';
//     company.verifiedAt = new Date();
//     company.verifiedBy = req.user.id;
//     await company.save({ session });

//     // Update all team members to active status
//     company.teamMembers.forEach(member => {
//       member.status = 'active';
//     });
//     await company.save({ session });

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Company verified successfully',
//       data: company
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Reject a company
// // @route   POST /api/admin/companies/:companyId/reject
// // @access  Private/Admin
// exports.rejectCompany = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { companyId } = req.params;
//     const { reason = 'Company registration rejected by admin' } = req.body;

//     const company = await Company.findById(companyId).session(session);

//     if (!company) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     if (company.verificationStatus !== 'pending') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Company is already ${company.verificationStatus}`
//       });
//     }

//     // Update company status
//     company.verificationStatus = 'rejected';
//     company.rejectionReason = reason;
//     company.rejectedAt = new Date();
//     company.rejectedBy = req.user.id;
//     await company.save({ session });

//     // Remove company references from users
//     const teamUserIds = company.teamMembers.map(member => member.user);
//     await User.updateMany(
//       { _id: { $in: teamUserIds } },
//       { 
//         $unset: { 
//           company: 1,
//           companyRole: 1
//         }
//       },
//       { session }
//     );

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Company rejected successfully',
//       data: company
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Update company status
// // @route   PUT /api/admin/companies/:companyId/status
// // @access  Private/Admin
// exports.updateCompanyStatus = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { companyId } = req.params;
//     const { status } = req.body;

//     // Validate status
//     if (!['pending', 'verified', 'rejected'].includes(status)) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Must be pending, verified, or rejected'
//       });
//     }

//     const company = await Company.findById(companyId).session(session);

//     if (!company) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     // Update company status
//     company.verificationStatus = status;
    
//     // Set timestamps based on status
//     if (status === 'verified') {
//       company.verifiedAt = new Date();
//       company.verifiedBy = req.user.id;
//       company.rejectionReason = undefined;
      
//       // Activate all team members
//       company.teamMembers.forEach(member => {
//         member.status = 'active';
//       });
//     } else if (status === 'rejected') {
//       company.rejectedAt = new Date();
//       company.rejectedBy = req.user.id;
      
//       // Remove company references from users if rejecting
//       const teamUserIds = company.teamMembers.map(member => member.user);
//       await User.updateMany(
//         { _id: { $in: teamUserIds } },
//         { 
//           $unset: { 
//             company: 1,
//             companyRole: 1
//           }
//         },
//         { session }
//       );
//     }

//     await company.save({ session });
//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: `Company status updated to ${status}`,
//       data: company
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get company statistics
// // @route   GET /api/admin/companies/stats
// // @access  Private/Admin
// exports.getCompanyStats = async (req, res, next) => {
//   try {
//     const [
//       totalCompanies,
//       verifiedCompanies,
//       pendingCompanies,
//       rejectedCompanies,
//       companiesByIndustry,
//       companiesBySize
//     ] = await Promise.all([
//       Company.countDocuments(),
//       Company.countDocuments({ verificationStatus: 'verified' }),
//       Company.countDocuments({ verificationStatus: 'pending' }),
//       Company.countDocuments({ verificationStatus: 'rejected' }),
//       Company.aggregate([
//         {
//           $group: {
//             _id: '$industry',
//             count: { $sum: 1 },
//             verified: {
//               $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] }
//             }
//           }
//         },
//         { $sort: { count: -1 } }
//       ]),
//       Company.aggregate([
//         {
//           $group: {
//             _id: '$companySize',
//             count: { $sum: 1 },
//             verified: {
//               $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] }
//             }
//           }
//         },
//         { $sort: { count: -1 } }
//       ])
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         totalCompanies,
//         verifiedCompanies,
//         pendingCompanies,
//         rejectedCompanies,
//         companiesByIndustry,
//         companiesBySize
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // In controllers/admin.js - Fix the approval rate calculation
// exports.getPrivateGigStats = async (req, res, next) => {
//   try {
//     const [
//       totalPrivateGigs,
//       totalApplications,
//       pendingApplications,
//       approvedApplications,
//       rejectedApplications
//     ] = await Promise.all([
//       Gig.countDocuments({ shareType: 'private' }),
//       Application.countDocuments(),
//       Application.countDocuments({ status: 'pending' }),
//       Application.countDocuments({ status: 'approved' }),
//       Application.countDocuments({ status: 'rejected' })
//     ]);

//     // FIX: Handle cases where totalApplications is 0
//     const approvalRate = totalApplications > 0 
//       ? Math.round((approvedApplications / totalApplications) * 100)
//       : 0; // Set to 0 instead of undefined

//     res.status(200).json({
//       success: true,
//       data: {
//         totalPrivateGigs,
//         totalApplications,
//         pendingApplications,
//         approvedApplications,
//         rejectedApplications,
//         approvalRate // This will always be a number (0-100)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get recent applications
// // @route   GET /api/admin/applications/recent
// // @access  Private/Admin
// exports.getRecentApplications = async (req, res, next) => {
//   try {
//     const { limit = 10 } = req.query;

//     const applications = await Application.find()
//       .populate('gig', 'title budget sharesRequired shareType user')
//       .populate('user', 'name email')
//       .populate({
//         path: 'gig',
//         populate: {
//           path: 'user',
//           select: 'name email'
//         }
//       })
//       .sort({ appliedAt: -1 })
//       .limit(parseInt(limit));

//     res.status(200).json({
//       success: true,
//       data: applications
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get application analytics
// // @route   GET /api/admin/applications/analytics
// // @access  Private/Admin
// exports.getApplicationAnalytics = async (req, res, next) => {
//   try {
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const [
//       totalApplications,
//       approvedApplications,
//       pendingApplications,
//       rejectedApplications,
//       applicationsByDay
//     ] = await Promise.all([
//       Application.countDocuments(),
//       Application.countDocuments({ status: 'approved' }),
//       Application.countDocuments({ status: 'pending' }),
//       Application.countDocuments({ status: 'rejected' }),
//       Application.aggregate([
//         { $match: { appliedAt: { $gte: thirtyDaysAgo } } },
//         {
//           $group: {
//             _id: {
//               $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' }
//             },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ])
//     ]);

//     const approvalRate = totalApplications > 0 
//       ? Math.round((approvedApplications / totalApplications) * 100)
//       : 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalApplications,
//         approvedApplications,
//         pendingApplications,
//         rejectedApplications,
//         approvalRate,
//         applicationsByDay,
//         avgResponseTime: 'N/A'
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all applications with filtering
// // @route   GET /api/admin/applications
// // @access  Private/Admin
// exports.getApplications = async (req, res, next) => {
//   try {
//     const { search = '', status = '', page = 1, limit = 20 } = req.query;
//     const skip = (page - 1) * limit;

//     // Build match query
//     let matchQuery = {};

//     // Add status filter if provided
//     if (status && status !== 'all') {
//       matchQuery.status = status;
//     }

//     let applications;
//     let total;

//     if (search) {
//       // If search is provided, use aggregation for complex search
//       applications = await Application.aggregate([
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'user',
//             foreignField: '_id',
//             as: 'userInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'gigs',
//             localField: 'gig',
//             foreignField: '_id',
//             as: 'gigInfo'
//           }
//         },
//         { $unwind: '$userInfo' },
//         { $unwind: '$gigInfo' },
//         {
//           $match: {
//             ...matchQuery,
//             $or: [
//               { 'userInfo.name': { $regex: search, $options: 'i' } },
//               { 'userInfo.email': { $regex: search, $options: 'i' } },
//               { 'gigInfo.title': { $regex: search, $options: 'i' } }
//             ]
//           }
//         },
//         {
//           $project: {
//             _id: 1,
//             status: 1,
//             message: 1,
//             appliedAt: 1,
//             reviewedAt: 1,
//             reviewNotes: 1,
//             shareCreated: 1,
//             user: {
//               _id: '$userInfo._id',
//               name: '$userInfo.name',
//               email: '$userInfo.email'
//             },
//             gig: {
//               _id: '$gigInfo._id',
//               title: '$gigInfo.title',
//               budget: '$gigInfo.budget',
//               sharesRequired: '$gigInfo.sharesRequired',
//               shareType: '$gigInfo.shareType',
//               user: '$gigInfo.user'
//             }
//           }
//         },
//         { $sort: { appliedAt: -1 } },
//         { $skip: skip },
//         { $limit: parseInt(limit) }
//       ]);

//       // Get total count for search
//       const totalResult = await Application.aggregate([
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'user',
//             foreignField: '_id',
//             as: 'userInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'gigs',
//             localField: 'gig',
//             foreignField: '_id',
//             as: 'gigInfo'
//           }
//         },
//         { $unwind: '$userInfo' },
//         { $unwind: '$gigInfo' },
//         {
//           $match: {
//             ...matchQuery,
//             $or: [
//               { 'userInfo.name': { $regex: search, $options: 'i' } },
//               { 'userInfo.email': { $regex: search, $options: 'i' } },
//               { 'gigInfo.title': { $regex: search, $options: 'i' } }
//             ]
//           }
//         },
//         { $count: 'total' }
//       ]);

//       total = totalResult[0]?.total || 0;
//     } else {
//       // Simple query without search
//       applications = await Application.find(matchQuery)
//         .populate('user', 'name email')
//         .populate({
//           path: 'gig',
//           select: 'title budget sharesRequired shareType user',
//           populate: {
//             path: 'user',
//             select: 'name email'
//           }
//         })
//         .sort({ appliedAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));

//       total = await Application.countDocuments(matchQuery);
//     }

//     res.status(200).json({
//       success: true,
//       data: applications,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Approve application
// // @route   POST /api/admin/applications/:applicationId/approve
// // @access  Private/Admin
// exports.approveApplication = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { applicationId } = req.params;
//     const { notes } = req.body;
//     const userId = req.user.id;

//     // Find application
//     const application = await Application.findById(applicationId)
//       .populate('gig')
//       .session(session);

//     if (!application) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Update application status
//     application.status = 'approved';
//     application.reviewedAt = new Date();
//     application.reviewedBy = userId;
//     application.reviewNotes = notes || 'Application approved';
    
//     // Add to gig's approved sharers
//     const gig = await Gig.findById(application.gig._id).session(session);
//     gig.approvedSharers.push({
//       user: application.user,
//       approvedAt: new Date(),
//       approvedBy: userId,
//       notes: notes || ''
//     });

//     // Update application status in gig's applications array
//     const gigApplication = gig.applications.find(app => 
//       app.user.toString() === application.user.toString()
//     );
//     if (gigApplication) {
//       gigApplication.status = 'approved';
//       gigApplication.reviewedAt = new Date();
//       gigApplication.reviewedBy = userId;
//       gigApplication.reviewNotes = notes || 'Application approved';
//     }

//     // Create share for the approved user
//     const trackingToken = crypto.randomBytes(16).toString('hex');
//     const share = await Share.create([{
//       gig: gig._id,
//       user: application.user,
//       trackingToken,
//       fromApplication: true,
//       applicationId: application._id
//     }], { session });

//     // Update application with share info
//     application.shareCreated = true;
//     application.shareId = share[0]._id;
//     await application.save({ session });

//     await gig.save({ session });
//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Application approved successfully',
//       data: {
//         application,
//         share: share[0],
//         shareUrl: `${req.protocol}://${req.get('host')}/share/${trackingToken}`
//       }
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Reject application
// // @route   POST /api/admin/applications/:applicationId/reject
// // @access  Private/Admin
// exports.rejectApplication = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { applicationId } = req.params;
//     const { reason } = req.body;
//     const userId = req.user.id;

//     // Find application
//     const application = await Application.findById(applicationId)
//       .populate('gig')
//       .session(session);

//     if (!application) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Application not found'
//       });
//     }

//     // Update application status
//     application.status = 'rejected';
//     application.reviewedAt = new Date();
//     application.reviewedBy = userId;
//     application.reviewNotes = reason || 'Application rejected';
//     await application.save({ session });

//     // Update application status in gig
//     const gig = await Gig.findById(application.gig._id).session(session);
//     const gigApplication = gig.applications.find(app => 
//       app.user.toString() === application.user.toString()
//     );
//     if (gigApplication) {
//       gigApplication.status = 'rejected';
//       gigApplication.reviewedAt = new Date();
//       gigApplication.reviewedBy = userId;
//       gigApplication.reviewNotes = reason || 'Application rejected';
//     }

//     await gig.save({ session });
//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Application rejected',
//       data: application
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // ✅ ADD: Invitation Management Controllers

// // @desc    Get all invitations with filtering
// // @route   GET /api/admin/invitations
// // @access  Private/Admin
// exports.getInvitations = async (req, res, next) => {
//   try {
//     const { search = '', status = '', type = '', page = 1, limit = 50 } = req.query;
//     const skip = (page - 1) * limit;

//     // Build query
//     let query = {};
    
//     // Status filter
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     // Sender type filter
//     if (type && type !== 'all') {
//       query.senderType = type;
//     }

//     let invitations;
//     let total;

//     if (search) {
//       // If search is provided, use aggregation for complex search
//       invitations = await Invitation.aggregate([
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'sender',
//             foreignField: '_id',
//             as: 'senderInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'recipient',
//             foreignField: '_id',
//             as: 'recipientInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'servicegigs',
//             localField: 'serviceGig',
//             foreignField: '_id',
//             as: 'serviceGigInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'gigs',
//             localField: 'targetGig',
//             foreignField: '_id',
//             as: 'targetGigInfo'
//           }
//         },
//         { $unwind: '$senderInfo' },
//         { $unwind: '$recipientInfo' },
//         { $unwind: '$serviceGigInfo' },
//         { $unwind: '$targetGigInfo' },
//         {
//           $match: {
//             ...query,
//             $or: [
//               { 'senderInfo.name': { $regex: search, $options: 'i' } },
//               { 'senderInfo.email': { $regex: search, $options: 'i' } },
//               { 'recipientInfo.name': { $regex: search, $options: 'i' } },
//               { 'recipientInfo.email': { $regex: search, $options: 'i' } },
//               { 'serviceGigInfo.title': { $regex: search, $options: 'i' } },
//               { 'targetGigInfo.title': { $regex: search, $options: 'i' } }
//             ]
//           }
//         },
//         {
//           $project: {
//             _id: 1,
//             status: 1,
//             message: 1,
//             compensation: 1,
//             customOffer: 1,
//             sentAt: 1,
//             respondedAt: 1,
//             senderType: 1,
//             sender: {
//               _id: '$senderInfo._id',
//               name: '$senderInfo.name',
//               email: '$senderInfo.email'
//             },
//             recipient: {
//               _id: '$recipientInfo._id',
//               name: '$recipientInfo.name',
//               email: '$recipientInfo.email'
//             },
//             serviceGig: {
//               _id: '$serviceGigInfo._id',
//               title: '$serviceGigInfo.title',
//               price: '$serviceGigInfo.price'
//             },
//             targetGig: {
//               _id: '$targetGigInfo._id',
//               title: '$targetGigInfo.title',
//               budget: '$targetGigInfo.budget',
//               shareType: '$targetGigInfo.shareType'
//             },
//             company: 1
//           }
//         },
//         { $sort: { sentAt: -1 } },
//         { $skip: skip },
//         { $limit: parseInt(limit) }
//       ]);

//       // Get total count for search
//       const totalResult = await Invitation.aggregate([
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'sender',
//             foreignField: '_id',
//             as: 'senderInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'recipient',
//             foreignField: '_id',
//             as: 'recipientInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'servicegigs',
//             localField: 'serviceGig',
//             foreignField: '_id',
//             as: 'serviceGigInfo'
//           }
//         },
//         {
//           $lookup: {
//             from: 'gigs',
//             localField: 'targetGig',
//             foreignField: '_id',
//             as: 'targetGigInfo'
//           }
//         },
//         { $unwind: '$senderInfo' },
//         { $unwind: '$recipientInfo' },
//         { $unwind: '$serviceGigInfo' },
//         { $unwind: '$targetGigInfo' },
//         {
//           $match: {
//             ...query,
//             $or: [
//               { 'senderInfo.name': { $regex: search, $options: 'i' } },
//               { 'senderInfo.email': { $regex: search, $options: 'i' } },
//               { 'recipientInfo.name': { $regex: search, $options: 'i' } },
//               { 'recipientInfo.email': { $regex: search, $options: 'i' } },
//               { 'serviceGigInfo.title': { $regex: search, $options: 'i' } },
//               { 'targetGigInfo.title': { $regex: search, $options: 'i' } }
//             ]
//           }
//         },
//         { $count: 'total' }
//       ]);

//       total = totalResult[0]?.total || 0;
//     } else {
//       // Simple query without search
//       invitations = await Invitation.find(query)
//         .populate('sender', 'name email')
//         .populate('recipient', 'name email')
//         .populate('serviceGig', 'title price')
//         .populate('targetGig', 'title budget shareType')
//         .populate('company', 'companyName')
//         .sort({ sentAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));

//       total = await Invitation.countDocuments(query);
//     }

//     res.status(200).json({
//       success: true,
//       data: invitations,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get invitation statistics
// // @route   GET /api/admin/invitations/stats
// // @access  Private/Admin
// exports.getInvitationStats = async (req, res, next) => {
//   try {
//     const [
//       total,
//       pending,
//       accepted,
//       rejected,
//       expired,
//       bySenderType,
//       recentActivity
//     ] = await Promise.all([
//       Invitation.countDocuments(),
//       Invitation.countDocuments({ status: 'pending' }),
//       Invitation.countDocuments({ status: 'accepted' }),
//       Invitation.countDocuments({ status: 'rejected' }),
//       Invitation.countDocuments({ status: 'expired' }),
//       Invitation.aggregate([
//         {
//           $group: {
//             _id: '$senderType',
//             count: { $sum: 1 },
//             accepted: {
//               $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//             },
//             pending: {
//               $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//             }
//           }
//         }
//       ]),
//       Invitation.aggregate([
//         {
//           $group: {
//             _id: {
//               $dateToString: { format: '%Y-%m-%d', date: '$sentAt' }
//             },
//             sent: { $sum: 1 },
//             accepted: {
//               $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//             }
//           }
//         },
//         { $sort: { _id: -1 } },
//         { $limit: 7 }
//       ])
//     ]);

//     // Calculate acceptance rate
//     const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

//     res.status(200).json({
//       success: true,
//       data: {
//         total,
//         pending,
//         accepted,
//         rejected,
//         expired,
//         acceptanceRate,
//         bySenderType,
//         recentActivity
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Accept invitation (Admin override)
// // @route   POST /api/admin/invitations/:invitationId/accept
// // @access  Private/Admin
// exports.acceptInvitation = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { invitationId } = req.params;
//     const { notes = 'Invitation accepted by admin' } = req.body;

//     const invitation = await Invitation.findById(invitationId).session(session);

//     if (!invitation) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Invitation not found'
//       });
//     }

//     if (invitation.status !== 'pending') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Invitation is already ${invitation.status}`
//       });
//     }

//     // Accept the invitation
//     await invitation.accept(notes);

//     // Populate the updated invitation
//     await invitation.populate([
//       { path: 'sender', select: 'name email' },
//       { path: 'recipient', select: 'name email' },
//       { path: 'serviceGig', select: 'title price' },
//       { path: 'targetGig', select: 'title budget' },
//       { path: 'autoCreatedApplication' }
//     ]);

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Invitation accepted successfully',
//       data: invitation
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Reject invitation (Admin override)
// // @route   POST /api/admin/invitations/:invitationId/reject
// // @access  Private/Admin
// exports.rejectInvitation = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { invitationId } = req.params;
//     const { reason = 'Invitation rejected by admin' } = req.body;

//     const invitation = await Invitation.findById(invitationId).session(session);

//     if (!invitation) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Invitation not found'
//       });
//     }

//     if (invitation.status !== 'pending') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: `Invitation is already ${invitation.status}`
//       });
//     }

//     // Reject the invitation
//     await invitation.reject(reason);

//     // Populate the updated invitation
//     await invitation.populate([
//       { path: 'sender', select: 'name email' },
//       { path: 'recipient', select: 'name email' },
//       { path: 'serviceGig', select: 'title price' },
//       { path: 'targetGig', select: 'title budget' }
//     ]);

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Invitation rejected',
//       data: invitation
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Send invitation as admin
// // @route   POST /api/admin/invitations/send
// // @access  Private/Admin
// exports.sendInvitationAsAdmin = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { serviceGigId, targetGigId, recipientId, message, compensation, customOffer } = req.body;

//     // Validate required fields
//     if (!serviceGigId || !targetGigId || !recipientId || !message) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Service gig, target gig, recipient, and message are required'
//       });
//     }

//     // Verify service gig exists and is active
//     const serviceGig = await ServiceGig.findOne({
//       _id: serviceGigId,
//       status: 'active'
//     }).populate('user').session(session);

//     if (!serviceGig) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Service gig not found or not active'
//       });
//     }

//     // Verify target gig exists
//     const targetGig = await Gig.findById(targetGigId).session(session);
//     if (!targetGig) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Target gig not found'
//       });
//     }

//     // Verify recipient exists
//     const recipient = await User.findById(recipientId).session(session);
//     if (!recipient) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Recipient not found'
//       });
//     }

//     // Check for existing invitation
//     const existingInvitation = await Invitation.findOne({
//       serviceGig: serviceGigId,
//       targetGig: targetGigId,
//       status: 'pending'
//     }).session(session);

//     if (existingInvitation) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'An active invitation already exists for this service gig'
//       });
//     }

//     // Create invitation as admin
//     const invitation = await Invitation.create([{
//       sender: req.user.id,
//       senderType: 'admin',
//       recipient: recipientId,
//       serviceGig: serviceGigId,
//       targetGig: targetGigId,
//       message: message.trim(),
//       compensation: compensation || null,
//       customOffer: customOffer || null,
//       adminNotes: 'Sent by admin'
//     }], { session });

//     // Populate the invitation
//     await invitation[0].populate([
//       { path: 'recipient', select: 'name email' },
//       { path: 'serviceGig', select: 'title price' },
//       { path: 'targetGig', select: 'title budget' }
//     ]);

//     await session.commitTransaction();

//     // TODO: Send email notification to recipient

//     res.status(201).json({
//       success: true,
//       message: 'Invitation sent successfully as admin',
//       data: invitation[0]
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Delete invitation
// // @route   DELETE /api/admin/invitations/:invitationId
// // @access  Private/Admin
// exports.deleteInvitation = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { invitationId } = req.params;

//     const invitation = await Invitation.findById(invitationId).session(session);

//     if (!invitation) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Invitation not found'
//       });
//     }

//     // Delete the invitation
//     await Invitation.findByIdAndDelete(invitationId).session(session);

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Invitation deleted successfully',
//       data: { id: invitationId }
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };


// controllers/admin.js
const User = require('../models/User');
const Company = require("../models/Company")
const Gig = require('../models/Gig');
const Share = require('../models/Share');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Application = require('../models/Application');
const Invitation = require('../models/Invitation');
const NotificationService = require('../utils/notificationService');
const crypto = require('crypto');
const mongoose = require('mongoose');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
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
      totalCompanies,
      verifiedCompanies,
      pendingCompanies,
      pendingInvitations
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
      Company.countDocuments(),
      Company.countDocuments({ verificationStatus: 'verified' }),
      Company.countDocuments({ verificationStatus: 'pending' }),
      Invitation.countDocuments({ status: 'pending' })
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
        totalCompanies,
        verifiedCompanies,
        pendingCompanies,
        pendingInvitations
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

    // 🔔 NOTIFICATION: User Role Updated
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Role Updated',
        message: `Your account role has been updated to ${role} by administrator.`,
        data: {
          previousRole: user.role,
          newRole: role,
          updatedBy: req.user.id,
          metadata: {
            updatedByAdmin: req.user.name
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Role update notification failed:', notifyError);
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

      // 🔔 NOTIFICATION: Withdrawal Processed
      try {
        await NotificationService.createNotification({
          userId: withdrawal.user,
          type: 'withdrawal_processed',
          title: 'Withdrawal Processed',
          message: `Your withdrawal of $${withdrawal.amount} has been processed and sent to your PayPal account.`,
          data: {
            withdrawalId: withdrawal._id,
            amount: withdrawal.amount,
            payoutBatchId: withdrawal.payoutBatchId,
            metadata: {
              amount: withdrawal.amount,
              processedAt: new Date(),
              paymentMethod: 'paypal'
            }
          },
          priority: 'high'
        });
      } catch (notifyError) {
        console.error('Withdrawal approval notification failed:', notifyError);
      }

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

      // 🔔 NOTIFICATION: Withdrawal Failed
      try {
        await NotificationService.createNotification({
          userId: withdrawal.user,
          type: 'withdrawal_failed',
          title: 'Withdrawal Failed',
          message: `Your withdrawal of $${withdrawal.amount} failed. Amount has been refunded to your wallet. Reason: Payment processor rejected the payout.`,
          data: {
            withdrawalId: withdrawal._id,
            amount: withdrawal.amount,
            reason: 'Payment processor rejected the payout',
            metadata: {
              amount: withdrawal.amount,
              refunded: true,
              failedAt: new Date()
            }
          },
          priority: 'high'
        });
      } catch (notifyError) {
        console.error('Withdrawal failure notification failed:', notifyError);
      }

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

    // 🔔 NOTIFICATION: Withdrawal Rejected
    try {
      await NotificationService.createNotification({
        userId: withdrawal.user,
        type: 'withdrawal_failed',
        title: 'Withdrawal Rejected',
        message: `Your withdrawal of $${withdrawal.amount} was rejected. Reason: ${reason}. Amount has been refunded to your wallet.`,
        data: {
          withdrawalId: withdrawal._id,
          amount: withdrawal.amount,
          reason: reason,
          metadata: {
            amount: withdrawal.amount,
            refunded: true,
            rejectedAt: new Date()
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Withdrawal rejection notification failed:', notifyError);
    }

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

    // 🔔 NOTIFICATION: Gig Approved by Admin
    try {
      await NotificationService.createNotification({
        userId: gig.user._id,
        type: 'system_announcement',
        title: 'Gig Approved',
        message: `Your gig "${gig.title}" has been approved by administrators and is now active.`,
        data: {
          gigId: gig._id,
          metadata: {
            gigTitle: gig.title,
            approvedAt: new Date()
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Gig approval notification failed:', notifyError);
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

    // 🔔 NOTIFICATION: Gig Rejected by Admin
    try {
      await NotificationService.createNotification({
        userId: gig.user._id,
        type: 'system_announcement',
        title: 'Gig Rejected',
        message: `Your gig "${gig.title}" was rejected. Reason: ${reason}`,
        data: {
          gigId: gig._id,
          reason: reason,
          metadata: {
            gigTitle: gig.title,
            rejectedAt: new Date(),
            reason: reason
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Gig rejection notification failed:', notifyError);
    }

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

    // 🔔 NOTIFICATION: Company Verified
    try {
      // Notify company owner
      await NotificationService.createNotification({
        userId: company.createdBy,
        type: 'system_announcement',
        title: 'Company Verified',
        message: `Your company "${company.companyName}" has been verified and is now active on the platform.`,
        data: {
          companyId: company._id,
          companyName: company.companyName,
          metadata: {
            verifiedAt: new Date(),
            verifiedBy: req.user.name
          }
        },
        priority: 'medium'
      });

      // Notify all team members
      for (const member of company.teamMembers) {
        await NotificationService.createNotification({
          userId: member.user,
          type: 'system_announcement',
          title: 'Company Verified',
          message: `The company "${company.companyName}" you are part of has been verified.`,
          data: {
            companyId: company._id,
            companyName: company.companyName,
            metadata: {
              verifiedAt: new Date(),
              yourRole: member.role
            }
          },
          priority: 'low'
        });
      }
    } catch (notifyError) {
      console.error('Company verification notifications failed:', notifyError);
    }

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

    // 🔔 NOTIFICATION: Company Rejected
    try {
      // Notify company owner
      await NotificationService.createNotification({
        userId: company.createdBy,
        type: 'system_announcement',
        title: 'Company Registration Rejected',
        message: `Your company registration for "${company.companyName}" was rejected. Reason: ${reason}`,
        data: {
          companyId: company._id,
          companyName: company.companyName,
          reason: reason,
          metadata: {
            rejectedAt: new Date(),
            rejectedBy: req.user.name
          }
        },
        priority: 'high'
      });

      // Notify all team members
      for (const member of company.teamMembers) {
        await NotificationService.createNotification({
          userId: member.user,
          type: 'system_announcement',
          title: 'Company Registration Rejected',
          message: `The company "${company.companyName}" registration was rejected.`,
          data: {
            companyId: company._id,
            companyName: company.companyName,
            reason: reason,
            metadata: {
              rejectedAt: new Date()
            }
          },
          priority: 'medium'
        });
      }
    } catch (notifyError) {
      console.error('Company rejection notifications failed:', notifyError);
    }

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

    // 🔔 NOTIFICATION: Company Status Updated
    try {
      await NotificationService.createNotification({
        userId: company.createdBy,
        type: 'system_announcement',
        title: 'Company Status Updated',
        message: `Your company "${company.companyName}" status has been updated to ${status}.`,
        data: {
          companyId: company._id,
          companyName: company.companyName,
          newStatus: status,
          metadata: {
            updatedAt: new Date(),
            updatedBy: req.user.name
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Company status update notification failed:', notifyError);
    }

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

// @desc    Get private gig stats
// @route   GET /api/admin/private-gig-stats
// @access  Private/Admin
exports.getPrivateGigStats = async (req, res, next) => {
  try {
    const [
      totalPrivateGigs,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    ] = await Promise.all([
      Gig.countDocuments({ shareType: 'private' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' })
    ]);

    // FIX: Handle cases where totalApplications is 0
    const approvalRate = totalApplications > 0 
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalPrivateGigs,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        approvalRate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent applications
// @route   GET /api/admin/applications/recent
// @access  Private/Admin
exports.getRecentApplications = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const applications = await Application.find()
      .populate('gig', 'title budget sharesRequired shareType user')
      .populate('user', 'name email')
      .populate({
        path: 'gig',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ appliedAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application analytics
// @route   GET /api/admin/applications/analytics
// @access  Private/Admin
exports.getApplicationAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      applicationsByDay
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'rejected' }),
      Application.aggregate([
        { $match: { appliedAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const approvalRate = totalApplications > 0 
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        approvalRate,
        applicationsByDay,
        avgResponseTime: 'N/A'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications with filtering
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    const { search = '', status = '', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Build match query
    let matchQuery = {};

    // Add status filter if provided
    if (status && status !== 'all') {
      matchQuery.status = status;
    }

    let applications;
    let total;

    if (search) {
      // If search is provided, use aggregation for complex search
      applications = await Application.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'gig',
            foreignField: '_id',
            as: 'gigInfo'
          }
        },
        { $unwind: '$userInfo' },
        { $unwind: '$gigInfo' },
        {
          $match: {
            ...matchQuery,
            $or: [
              { 'userInfo.name': { $regex: search, $options: 'i' } },
              { 'userInfo.email': { $regex: search, $options: 'i' } },
              { 'gigInfo.title': { $regex: search, $options: 'i' } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            status: 1,
            message: 1,
            appliedAt: 1,
            reviewedAt: 1,
            reviewNotes: 1,
            shareCreated: 1,
            user: {
              _id: '$userInfo._id',
              name: '$userInfo.name',
              email: '$userInfo.email'
            },
            gig: {
              _id: '$gigInfo._id',
              title: '$gigInfo.title',
              budget: '$gigInfo.budget',
              sharesRequired: '$gigInfo.sharesRequired',
              shareType: '$gigInfo.shareType',
              user: '$gigInfo.user'
            }
          }
        },
        { $sort: { appliedAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Get total count for search
      const totalResult = await Application.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'gig',
            foreignField: '_id',
            as: 'gigInfo'
          }
        },
        { $unwind: '$userInfo' },
        { $unwind: '$gigInfo' },
        {
          $match: {
            ...matchQuery,
            $or: [
              { 'userInfo.name': { $regex: search, $options: 'i' } },
              { 'userInfo.email': { $regex: search, $options: 'i' } },
              { 'gigInfo.title': { $regex: search, $options: 'i' } }
            ]
          }
        },
        { $count: 'total' }
      ]);

      total = totalResult[0]?.total || 0;
    } else {
      // Simple query without search
      applications = await Application.find(matchQuery)
        .populate('user', 'name email')
        .populate({
          path: 'gig',
          select: 'title budget sharesRequired shareType user',
          populate: {
            path: 'user',
            select: 'name email'
          }
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      total = await Application.countDocuments(matchQuery);
    }

    res.status(200).json({
      success: true,
      data: applications,
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

// @desc    Approve application
// @route   POST /api/admin/applications/:applicationId/approve
// @access  Private/Admin
exports.approveApplication = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicationId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    // Find application
    const application = await Application.findById(applicationId)
      .populate('gig')
      .session(session);

    if (!application) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application status
    application.status = 'approved';
    application.reviewedAt = new Date();
    application.reviewedBy = userId;
    application.reviewNotes = notes || 'Application approved';
    
    // Add to gig's approved sharers
    const gig = await Gig.findById(application.gig._id).session(session);
    gig.approvedSharers.push({
      user: application.user,
      approvedAt: new Date(),
      approvedBy: userId,
      notes: notes || ''
    });

    // Update application status in gig's applications array
    const gigApplication = gig.applications.find(app => 
      app.user.toString() === application.user.toString()
    );
    if (gigApplication) {
      gigApplication.status = 'approved';
      gigApplication.reviewedAt = new Date();
      gigApplication.reviewedBy = userId;
      gigApplication.reviewNotes = notes || 'Application approved';
    }

    // Create share for the approved user
    const trackingToken = crypto.randomBytes(16).toString('hex');
    const share = await Share.create([{
      gig: gig._id,
      user: application.user,
      trackingToken,
      fromApplication: true,
      applicationId: application._id
    }], { session });

    // Update application with share info
    application.shareCreated = true;
    application.shareId = share[0]._id;
    await application.save({ session });

    await gig.save({ session });

    // 🔔 NOTIFICATION: Application Approved
    try {
      await NotificationService.createNotification({
        userId: application.user,
        type: 'application_received',
        title: 'Application Approved!',
        message: `Your application for gig "${gig.title}" has been approved! You can now start sharing.`,
        data: {
          gigId: gig._id,
          applicationId: application._id,
          shareId: share[0]._id,
          metadata: {
            gigTitle: gig.title,
            approvedAt: new Date(),
            shareToken: trackingToken
          }
        },
        priority: 'high'
      });

      // Notify gig owner about new approved sharer
      await NotificationService.createNotification({
        userId: gig.user,
        type: 'application_received',
        title: 'New Sharer Approved',
        message: `A user has been approved to share your gig "${gig.title}".`,
        data: {
          gigId: gig._id,
          applicationId: application._id,
          approvedUserId: application.user,
          metadata: {
            gigTitle: gig.title,
            approvedAt: new Date()
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Application approval notifications failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: {
        application,
        share: share[0],
        shareUrl: `${req.protocol}://${req.get('host')}/share/${trackingToken}`
      }
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Reject application
// @route   POST /api/admin/applications/:applicationId/reject
// @access  Private/Admin
exports.rejectApplication = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicationId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Find application
    const application = await Application.findById(applicationId)
      .populate('gig')
      .session(session);

    if (!application) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application status
    application.status = 'rejected';
    application.reviewedAt = new Date();
    application.reviewedBy = userId;
    application.reviewNotes = reason || 'Application rejected';
    await application.save({ session });

    // Update application status in gig
    const gig = await Gig.findById(application.gig._id).session(session);
    const gigApplication = gig.applications.find(app => 
      app.user.toString() === application.user.toString()
    );
    if (gigApplication) {
      gigApplication.status = 'rejected';
      gigApplication.reviewedAt = new Date();
      gigApplication.reviewedBy = userId;
      gigApplication.reviewNotes = reason || 'Application rejected';
    }

    await gig.save({ session });

    // 🔔 NOTIFICATION: Application Rejected
    try {
      await NotificationService.createNotification({
        userId: application.user,
        type: 'system_announcement',
        title: 'Application Rejected',
        message: `Your application for gig "${gig.title}" was rejected. Reason: ${reason || 'No reason provided'}`,
        data: {
          gigId: gig._id,
          applicationId: application._id,
          reason: reason,
          metadata: {
            gigTitle: gig.title,
            rejectedAt: new Date()
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Application rejection notification failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get all invitations with filtering
// @route   GET /api/admin/invitations
// @access  Private/Admin
exports.getInvitations = async (req, res, next) => {
  try {
    const { search = '', status = '', type = '', page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Sender type filter
    if (type && type !== 'all') {
      query.senderType = type;
    }

    let invitations;
    let total;

    if (search) {
      // If search is provided, use aggregation for complex search
      invitations = await Invitation.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'senderInfo'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recipient',
            foreignField: '_id',
            as: 'recipientInfo'
          }
        },
        {
          $lookup: {
            from: 'servicegigs',
            localField: 'serviceGig',
            foreignField: '_id',
            as: 'serviceGigInfo'
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'targetGig',
            foreignField: '_id',
            as: 'targetGigInfo'
          }
        },
        { $unwind: '$senderInfo' },
        { $unwind: '$recipientInfo' },
        { $unwind: '$serviceGigInfo' },
        { $unwind: '$targetGigInfo' },
        {
          $match: {
            ...query,
            $or: [
              { 'senderInfo.name': { $regex: search, $options: 'i' } },
              { 'senderInfo.email': { $regex: search, $options: 'i' } },
              { 'recipientInfo.name': { $regex: search, $options: 'i' } },
              { 'recipientInfo.email': { $regex: search, $options: 'i' } },
              { 'serviceGigInfo.title': { $regex: search, $options: 'i' } },
              { 'targetGigInfo.title': { $regex: search, $options: 'i' } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            status: 1,
            message: 1,
            compensation: 1,
            customOffer: 1,
            sentAt: 1,
            respondedAt: 1,
            senderType: 1,
            sender: {
              _id: '$senderInfo._id',
              name: '$senderInfo.name',
              email: '$senderInfo.email'
            },
            recipient: {
              _id: '$recipientInfo._id',
              name: '$recipientInfo.name',
              email: '$recipientInfo.email'
            },
            serviceGig: {
              _id: '$serviceGigInfo._id',
              title: '$serviceGigInfo.title',
              price: '$serviceGigInfo.price'
            },
            targetGig: {
              _id: '$targetGigInfo._id',
              title: '$targetGigInfo.title',
              budget: '$targetGigInfo.budget',
              shareType: '$targetGigInfo.shareType'
            },
            company: 1
          }
        },
        { $sort: { sentAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      // Get total count for search
      const totalResult = await Invitation.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'senderInfo'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recipient',
            foreignField: '_id',
            as: 'recipientInfo'
          }
        },
        {
          $lookup: {
            from: 'servicegigs',
            localField: 'serviceGig',
            foreignField: '_id',
            as: 'serviceGigInfo'
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'targetGig',
            foreignField: '_id',
            as: 'targetGigInfo'
          }
        },
        { $unwind: '$senderInfo' },
        { $unwind: '$recipientInfo' },
        { $unwind: '$serviceGigInfo' },
        { $unwind: '$targetGigInfo' },
        {
          $match: {
            ...query,
            $or: [
              { 'senderInfo.name': { $regex: search, $options: 'i' } },
              { 'senderInfo.email': { $regex: search, $options: 'i' } },
              { 'recipientInfo.name': { $regex: search, $options: 'i' } },
              { 'recipientInfo.email': { $regex: search, $options: 'i' } },
              { 'serviceGigInfo.title': { $regex: search, $options: 'i' } },
              { 'targetGigInfo.title': { $regex: search, $options: 'i' } }
            ]
          }
        },
        { $count: 'total' }
      ]);

      total = totalResult[0]?.total || 0;
    } else {
      // Simple query without search
      invitations = await Invitation.find(query)
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .populate('serviceGig', 'title price')
        .populate('targetGig', 'title budget shareType')
        .populate('company', 'companyName')
        .sort({ sentAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      total = await Invitation.countDocuments(query);
    }

    res.status(200).json({
      success: true,
      data: invitations,
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

// @desc    Get invitation statistics
// @route   GET /api/admin/invitations/stats
// @access  Private/Admin
exports.getInvitationStats = async (req, res, next) => {
  try {
    const [
      total,
      pending,
      accepted,
      rejected,
      expired,
      bySenderType,
      recentActivity
    ] = await Promise.all([
      Invitation.countDocuments(),
      Invitation.countDocuments({ status: 'pending' }),
      Invitation.countDocuments({ status: 'accepted' }),
      Invitation.countDocuments({ status: 'rejected' }),
      Invitation.countDocuments({ status: 'expired' }),
      Invitation.aggregate([
        {
          $group: {
            _id: '$senderType',
            count: { $sum: 1 },
            accepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        }
      ]),
      Invitation.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$sentAt' }
            },
            sent: { $sum: 1 },
            accepted: {
              $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
            }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 7 }
      ])
    ]);

    // Calculate acceptance rate
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        accepted,
        rejected,
        expired,
        acceptanceRate,
        bySenderType,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept invitation (Admin override)
// @route   POST /api/admin/invitations/:invitationId/accept
// @access  Private/Admin
exports.acceptInvitation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invitationId } = req.params;
    const { notes = 'Invitation accepted by admin' } = req.body;

    const invitation = await Invitation.findById(invitationId).session(session);

    if (!invitation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Invitation is already ${invitation.status}`
      });
    }

    // Accept the invitation
    await invitation.accept(notes);

    // Populate the updated invitation
    await invitation.populate([
      { path: 'sender', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'serviceGig', select: 'title price' },
      { path: 'targetGig', select: 'title budget' },
      { path: 'autoCreatedApplication' }
    ]);

    // 🔔 NOTIFICATION: Invitation Accepted by Admin
    try {
      await NotificationService.createNotification({
        userId: invitation.sender._id,
        type: 'system_announcement',
        title: 'Invitation Accepted',
        message: `Your invitation for "${invitation.serviceGig.title}" was accepted by administrator.`,
        data: {
          invitationId: invitation._id,
          serviceGigId: invitation.serviceGig._id,
          targetGigId: invitation.targetGig._id,
          metadata: {
            serviceGigTitle: invitation.serviceGig.title,
            targetGigTitle: invitation.targetGig.title,
            acceptedByAdmin: true
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation acceptance notification failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      data: invitation
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Reject invitation (Admin override)
// @route   POST /api/admin/invitations/:invitationId/reject
// @access  Private/Admin
exports.rejectInvitation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invitationId } = req.params;
    const { reason = 'Invitation rejected by admin' } = req.body;

    const invitation = await Invitation.findById(invitationId).session(session);

    if (!invitation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    if (invitation.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Invitation is already ${invitation.status}`
      });
    }

    // Reject the invitation
    await invitation.reject(reason);

    // Populate the updated invitation
    await invitation.populate([
      { path: 'sender', select: 'name email' },
      { path: 'recipient', select: 'name email' },
      { path: 'serviceGig', select: 'title price' },
      { path: 'targetGig', select: 'title budget' }
    ]);

    // 🔔 NOTIFICATION: Invitation Rejected by Admin
    try {
      await NotificationService.createNotification({
        userId: invitation.sender._id,
        type: 'system_announcement',
        title: 'Invitation Rejected',
        message: `Your invitation for "${invitation.serviceGig.title}" was rejected by administrator. Reason: ${reason}`,
        data: {
          invitationId: invitation._id,
          serviceGigId: invitation.serviceGig._id,
          reason: reason,
          metadata: {
            serviceGigTitle: invitation.serviceGig.title,
            rejectedByAdmin: true
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation rejection notification failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Invitation rejected',
      data: invitation
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Send invitation as admin
// @route   POST /api/admin/invitations/send
// @access  Private/Admin
exports.sendInvitationAsAdmin = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { serviceGigId, targetGigId, recipientId, message, compensation, customOffer } = req.body;

    // Validate required fields
    if (!serviceGigId || !targetGigId || !recipientId || !message) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Service gig, target gig, recipient, and message are required'
      });
    }

    // Verify service gig exists and is active
    const serviceGig = await ServiceGig.findOne({
      _id: serviceGigId,
      status: 'active'
    }).populate('user').session(session);

    if (!serviceGig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Service gig not found or not active'
      });
    }

    // Verify target gig exists
    const targetGig = await Gig.findById(targetGigId).session(session);
    if (!targetGig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Target gig not found'
      });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId).session(session);
    if (!recipient) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check for existing invitation
    const existingInvitation = await Invitation.findOne({
      serviceGig: serviceGigId,
      targetGig: targetGigId,
      status: 'pending'
    }).session(session);

    if (existingInvitation) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'An active invitation already exists for this service gig'
      });
    }

    // Create invitation as admin
    const invitation = await Invitation.create([{
      sender: req.user.id,
      senderType: 'admin',
      recipient: recipientId,
      serviceGig: serviceGigId,
      targetGig: targetGigId,
      message: message.trim(),
      compensation: compensation || null,
      customOffer: customOffer || null,
      adminNotes: 'Sent by admin'
    }], { session });

    // Populate the invitation
    await invitation[0].populate([
      { path: 'recipient', select: 'name email' },
      { path: 'serviceGig', select: 'title price' },
      { path: 'targetGig', select: 'title budget' }
    ]);

    // 🔔 NOTIFICATION: Invitation Sent by Admin
    try {
      await NotificationService.createNotification({
        userId: recipientId,
        type: 'system_announcement',
        title: 'New Invitation',
        message: `You have received a new invitation from administrator for "${serviceGig.title}".`,
        data: {
          invitationId: invitation[0]._id,
          serviceGigId: serviceGigId,
          targetGigId: targetGigId,
          metadata: {
            serviceGigTitle: serviceGig.title,
            targetGigTitle: targetGig.title,
            sentByAdmin: true
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation sent notification failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully as admin',
      data: invitation[0]
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Delete invitation
// @route   DELETE /api/admin/invitations/:invitationId
// @access  Private/Admin
exports.deleteInvitation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { invitationId } = req.params;

    const invitation = await Invitation.findById(invitationId).session(session);

    if (!invitation) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    // Delete the invitation
    await Invitation.findByIdAndDelete(invitationId).session(session);

    // 🔔 NOTIFICATION: Invitation Deleted by Admin
    try {
      if (invitation.status === 'pending') {
        await NotificationService.createNotification({
          userId: invitation.sender,
          type: 'system_announcement',
          title: 'Invitation Deleted',
          message: `Your invitation for "${invitation.serviceGig?.title || 'service gig'}" was deleted by administrator.`,
          data: {
            invitationId: invitation._id,
            metadata: {
              deletedByAdmin: true,
              deletedAt: new Date()
            }
          },
          priority: 'medium'
        });
      }
    } catch (notifyError) {
      console.error('Invitation deletion notification failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Invitation deleted successfully',
      data: { id: invitationId }
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};


/**********************
 * NEW: Get social share analytics for a share
 **********************/
exports.getSocialShareAnalytics = async (req, res, next) => {
  try {
    const { shareId } = req.params;
    const userId = req.user.id;

    const share = await Share.findById(shareId);
    
    if (!share) {
      return res.status(404).json({ success: false, message: 'Share not found' });
    }

    if (share.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const analytics = {
      totalSocialShares: share.totalSocialShares || 0,
      platforms: share.socialSharesByPlatform || {},
      recentShares: share.socialShares?.slice(-10) || [], // Last 10 shares
      sharePerformance: {
        socialToClickRatio: share.totalClicks > 0 ? (share.totalSocialShares / share.totalClicks) : 0,
        uniqueEngagement: share.uniqueClicks > 0 ? (share.totalSocialShares / share.uniqueClicks) : 0
      }
    };

    res.status(200).json({
      success: true,
      data: analytics
    });

  } catch (error) {
    next(error);
  }
};