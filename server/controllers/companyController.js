
// // controllers/company.js
// const Company = require('../models/Company');
// const User = require('../models/User');
// const Gig = require('../models/Gig');
// const Share = require('../models/Share');
// const Application = require('../models/Application');
// const Invitation = require('../models/Invitation');
// const mongoose = require('mongoose');

// // @desc    Get company dashboard data
// // @route   GET /api/company/dashboard
// // @access  Private/Company
// // controllers/company.js - Update getCompanyDashboard
// exports.getCompanyDashboard = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;

//     if (!companyId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User is not associated with any company'
//       });
//     }

//     console.log('🔍 Company ID:', companyId);
//     console.log('🔍 User company role:', req.user.companyRole);

//     const company = await Company.findById(companyId)
//       .populate('teamMembers.user', 'name email role lastLogin');

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     // Get all team member user IDs
//     const teamMemberIds = company.teamMembers.map(member => member.user._id);
//     console.log('🔍 Team member IDs:', teamMemberIds);

//     // Get gigs created by any team member of this company
//     const [
//       totalGigs,
//       activeGigs,
//       completedGigs,
//       totalShares,
//       approvedShares,
//       totalSpent,
//       pendingInvitations,
//       teamPerformance,
//       recentGigs,
//       recentShares
//     ] = await Promise.all([
//       // Gig stats - query by user IDs in the company
//       Gig.countDocuments({ user: { $in: teamMemberIds } }).catch(err => {
//         console.error('❌ Error counting total gigs:', err);
//         return 0;
//       }),
//       Gig.countDocuments({ 
//         user: { $in: teamMemberIds }, 
//         isActive: true 
//       }).catch(err => {
//         console.error('❌ Error counting active gigs:', err);
//         return 0;
//       }),
//       Gig.countDocuments({ 
//         user: { $in: teamMemberIds }, 
//         isActive: false 
//       }).catch(err => {
//         console.error('❌ Error counting completed gigs:', err);
//         return 0;
//       }),
      
//       // Share stats - query by company ID (assuming Share model has company field)
//       Share.countDocuments({ company: companyId }).catch(err => {
//         console.error('❌ Error counting total shares:', err);
//         return 0;
//       }),
//       Share.countDocuments({ 
//         company: companyId, 
//         submissionStatus: 'approved' 
//       }).catch(err => {
//         console.error('❌ Error counting approved shares:', err);
//         return 0;
//       }),
      
//       // Financial stats - aggregate by user IDs in the company
//       Gig.aggregate([
//         { $match: { user: { $in: teamMemberIds } } },
//         {
//           $group: {
//             _id: null,
//             totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//             totalBudget: { $sum: '$budget' },
//             platformFees: { $sum: '$platformFee' }
//           }
//         }
//       ]).catch(err => {
//         console.error('❌ Error in financial aggregation:', err);
//         return [{}];
//       }),
      
//       // Invitation stats
//       Invitation.countDocuments({ 
//         company: companyId,
//         status: 'pending'
//       }).catch(err => {
//         console.error('❌ Error counting pending invitations:', err);
//         return 0;
//       }),
      
//       // Team performance
//       Share.aggregate([
//         { $match: { company: new mongoose.Types.ObjectId(companyId) } },
//         {
//           $group: {
//             _id: '$user',
//             totalShares: { $sum: 1 },
//             approvedShares: {
//               $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
//             },
//             totalEarnings: { $sum: '$amountEarned' },
//             totalClicks: { $sum: '$totalClicks' },
//             uniqueClicks: { $sum: '$uniqueClicks' }
//           }
//         },
//         {
//           $lookup: {
//             from: 'users',
//             localField: '_id',
//             foreignField: '_id',
//             as: 'user'
//           }
//         },
//         { $unwind: '$user' },
//         {
//           $project: {
//             userId: '$_id',
//             userName: '$user.name',
//             userEmail: '$user.email',
//             totalShares: 1,
//             approvedShares: 1,
//             approvalRate: {
//               $cond: [
//                 { $gt: ['$totalShares', 0] },
//                 { $multiply: [{ $divide: ['$approvedShares', '$totalShares'] }, 100] },
//                 0
//               ]
//             },
//             totalEarnings: 1,
//             totalClicks: 1,
//             uniqueClicks: 1,
//             clickThroughRate: {
//               $cond: [
//                 { $gt: ['$totalClicks', 0] },
//                 { $multiply: [{ $divide: ['$uniqueClicks', '$totalClicks'] }, 100] },
//                 0
//               ]
//             }
//           }
//         },
//         { $sort: { totalShares: -1 } }
//       ]).catch(err => {
//         console.error('❌ Error in team performance aggregation:', err);
//         return [];
//       }),

//       // Recent gigs - get gigs from company team members
//       Gig.find({ user: { $in: teamMemberIds } })
//         .select('title budget contentType isActive sharesCompleted sharesRequired createdAt')
//         .populate('user', 'name email')
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .catch(err => {
//           console.error('❌ Error fetching recent gigs:', err);
//           return [];
//         }),

//       // Recent shares
//       Share.find({ company: companyId })
//         .populate('gig', 'title')
//         .populate('user', 'name')
//         .select('gig user submissionStatus amountEarned totalClicks createdAt')
//         .sort({ createdAt: -1 })
//         .limit(10)
//         .catch(err => {
//           console.error('❌ Error fetching recent shares:', err);
//           return [];
//         })
//     ]);

//     const financialStats = totalSpent[0] || {
//       totalSpent: 0,
//       totalBudget: 0,
//       platformFees: 0
//     };

//     console.log('✅ Total gigs found:', totalGigs);
//     console.log('✅ Recent gigs:', recentGigs.length);

//     res.status(200).json({
//       success: true,
//       data: {
//         company,
//         stats: {
//           totalGigs,
//           activeGigs,
//           completedGigs,
//           totalShares,
//           approvedShares,
//           pendingInvitations,
//           financial: {
//             totalSpent: financialStats.totalSpent,
//             totalBudget: financialStats.totalBudget,
//             platformFees: financialStats.platformFees,
//             remainingBudget: financialStats.totalBudget - financialStats.totalSpent
//           },
//           approvalRate: totalShares > 0 ? Math.round((approvedShares / totalShares) * 100) : 0
//         },
//         teamPerformance,
//         recentActivity: {
//           gigs: recentGigs,
//           shares: recentShares
//         }
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error in getCompanyDashboard:', error);
//     next(error);
//   }
// };
// // @desc    Get company profile
// // @route   GET /api/company/profile
// // @access  Private/Company
// exports.getCompanyProfile = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;

//     const company = await Company.findById(companyId)
//       .populate('teamMembers.user', 'name email role avatar lastLogin');

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: company
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update company profile
// // @route   PUT /api/company/profile
// // @access  Private/Company (Admin/Manager/Owner roles)
// exports.updateCompanyProfile = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const companyId = req.user.company;
//     const userRole = req.user.companyRole;

//     // FIX: Include 'owner' in allowed roles
//     if (!['admin', 'manager', 'owner'].includes(userRole)) {
//       await session.abortTransaction();
//       return res.status(403).json({
//         success: false,
//         message: 'Only company admins, managers, and owners can update company profile'
//       });
//     }

//     const {
//       companyName,
//       description,
//       website,
//       industry,
//       companySize,
//       address,
//       socialMedia,
//       logo
//     } = req.body;

//     const company = await Company.findById(companyId).session(session);

//     if (!company) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     // Update allowed fields
//     const updateFields = {};
//     if (companyName) updateFields.companyName = companyName;
//     if (description) updateFields.description = description;
//     if (website) updateFields.website = website;
//     if (industry) updateFields.industry = industry;
//     if (companySize) updateFields.companySize = companySize;
//     if (address) updateFields.address = address;
//     if (socialMedia) updateFields.socialMedia = socialMedia;
//     if (logo) updateFields.logo = logo;

//     const updatedCompany = await Company.findByIdAndUpdate(
//       companyId,
//       updateFields,
//       { new: true, session }
//     ).populate('teamMembers.user', 'name email role');

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: 'Company profile updated successfully',
//       data: updatedCompany
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get company gigs
// // @route   GET /api/company/gigs
// // @access  Private/Company
// // @desc    Get company gigs
// // @route   GET /api/company/gigs
// // @access  Private/Company
// exports.getCompanyGigs = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
//     const { 
//       status = '', 
//       search = '', 
//       page = 1, 
//       limit = 20,
//       sort = '-createdAt'
//     } = req.query;
    
//     const skip = (page - 1) * limit;

//     // Get company team members
//     const company = await Company.findById(companyId).select('teamMembers');
//     const teamMemberIds = company.teamMembers.map(member => member.user);

//     // Build query - gigs created by company team members
//     let query = { user: { $in: teamMemberIds } };

//     // Status filter
//     if (status && status !== 'all') {
//       if (status === 'active') {
//         query.isActive = true;
//       } else if (status === 'completed') {
//         query.isActive = false;
//       } else if (status === 'draft') {
//         query.status = 'draft';
//       }
//     }

//     // Search filter
//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const gigs = await Gig.find(query)
//       .select('-applications -approvedSharers')
//       .populate('user', 'name email')
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Gig.countDocuments(query);

//     // Get gig performance stats
//     const gigStats = await Gig.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: null,
//           totalBudget: { $sum: '$budget' },
//           totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//           totalSharesCompleted: { $sum: '$sharesCompleted' },
//           totalClicks: { $sum: '$totalClicks' },
//           avgCompletionRate: {
//             $avg: {
//               $multiply: [{ $divide: ['$sharesCompleted', '$sharesRequired'] }, 100]
//             }
//           }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: gigs,
//       stats: gigStats[0] || {
//         totalBudget: 0,
//         totalSpent: 0,
//         totalSharesCompleted: 0,
//         totalClicks: 0,
//         avgCompletionRate: 0
//       },
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

// // @desc    Get company gig performance analytics
// // @route   GET /api/company/gigs/analytics
// // @access  Private/Company
// exports.getGigAnalytics = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
//     const { period = '30d' } = req.query;

//     // Calculate date range
//     const dateRange = new Date();
//     if (period === '7d') {
//       dateRange.setDate(dateRange.getDate() - 7);
//     } else if (period === '30d') {
//       dateRange.setDate(dateRange.getDate() - 30);
//     } else if (period === '90d') {
//       dateRange.setDate(dateRange.getDate() - 90);
//     } else {
//       dateRange.setDate(dateRange.getDate() - 30); // Default 30 days
//     }

//     const analytics = await Gig.aggregate([
//       {
//         $match: {
//           company: new mongoose.Types.ObjectId(companyId),
//           createdAt: { $gte: dateRange }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
//           },
//           gigsCreated: { $sum: 1 },
//           totalBudget: { $sum: '$budget' },
//           totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//           sharesCompleted: { $sum: '$sharesCompleted' },
//           totalClicks: { $sum: '$totalClicks' }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     // Performance by content type
//     const performanceByType = await Gig.aggregate([
//       {
//         $match: {
//           company: new mongoose.Types.ObjectId(companyId),
//           createdAt: { $gte: dateRange }
//         }
//       },
//       {
//         $group: {
//           _id: '$contentType',
//           totalGigs: { $sum: 1 },
//           completedGigs: {
//             $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
//           },
//           totalBudget: { $sum: '$budget' },
//           totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//           totalShares: { $sum: '$sharesCompleted' },
//           totalClicks: { $sum: '$totalClicks' },
//           avgCompletionRate: {
//             $avg: {
//               $multiply: [{ $divide: ['$sharesCompleted', '$sharesRequired'] }, 100]
//             }
//           },
//           avgCostPerShare: {
//             $avg: {
//               $cond: [
//                 { $gt: ['$sharesCompleted', 0] },
//                 { $divide: [{ $subtract: ['$budget', '$availableFunds'] }, '$sharesCompleted'] },
//                 0
//               ]
//             }
//           }
//         }
//       },
//       { $sort: { totalGigs: -1 } }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         timeline: analytics,
//         performanceByType,
//         period
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get company shares
// // @route   GET /api/company/shares
// // @access  Private/Company
// exports.getCompanyShares = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
//     const { 
//       status = '', 
//       gig = '', 
//       user = '', 
//       page = 1, 
//       limit = 50 
//     } = req.query;
    
//     const skip = (page - 1) * limit;

//     // Build query
//     let query = { company: companyId };

//     // Status filter
//     if (status && status !== 'all') {
//       query.submissionStatus = status;
//     }

//     // Gig filter
//     if (gig) {
//       query.gig = gig;
//     }

//     // User filter
//     if (user) {
//       query.user = user;
//     }

//     const shares = await Share.find(query)
//       .populate('gig', 'title budget contentType')
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Share.countDocuments(query);

//     // Share performance stats
//     const shareStats = await Share.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: null,
//           totalShares: { $sum: 1 },
//           approvedShares: {
//             $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
//           },
//           pendingShares: {
//             $sum: { $cond: [{ $eq: ['$submissionStatus', 'pending'] }, 1, 0] }
//           },
//           rejectedShares: {
//             $sum: { $cond: [{ $eq: ['$submissionStatus', 'rejected'] }, 1, 0] }
//           },
//           totalEarnings: { $sum: '$amountEarned' },
//           totalClicks: { $sum: '$totalClicks' },
//           uniqueClicks: { $sum: '$uniqueClicks' }
//         }
//       }
//     ]);

//     const stats = shareStats[0] || {
//       totalShares: 0,
//       approvedShares: 0,
//       pendingShares: 0,
//       rejectedShares: 0,
//       totalEarnings: 0,
//       totalClicks: 0,
//       uniqueClicks: 0
//     };

//     res.status(200).json({
//       success: true,
//       data: shares,
//       stats: {
//         ...stats,
//         approvalRate: stats.totalShares > 0 ? Math.round((stats.approvedShares / stats.totalShares) * 100) : 0,
//         clickThroughRate: stats.totalClicks > 0 ? Math.round((stats.uniqueClicks / stats.totalClicks) * 100) : 0
//       },
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

// // @desc    Get company team members
// // @route   GET /api/company/team
// // @access  Private/Company
// exports.getCompanyTeam = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;

//     const company = await Company.findById(companyId)
//       .populate('teamMembers.user', 'name email avatar role lastLogin')
//       .select('teamMembers');

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     // Get team performance stats
//     const teamStats = await Share.aggregate([
//       {
//         $match: { company: new mongoose.Types.ObjectId(companyId) }
//       },
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
//           lastActivity: { $max: '$createdAt' }
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
//       { $unwind: '$user' }
//     ]);

//     // Merge team members with their stats
//     const teamWithStats = company.teamMembers.map(member => {
//       const memberStats = teamStats.find(stat => 
//         stat._id.toString() === member.user._id.toString()
//       ) || {
//         totalShares: 0,
//         approvedShares: 0,
//         totalEarnings: 0,
//         totalClicks: 0,
//         uniqueClicks: 0,
//         lastActivity: null
//       };

//       return {
//         ...member.toObject(),
//         stats: {
//           ...memberStats,
//           approvalRate: memberStats.totalShares > 0 ? 
//             Math.round((memberStats.approvedShares / memberStats.totalShares) * 100) : 0,
//           clickThroughRate: memberStats.totalClicks > 0 ?
//             Math.round((memberStats.uniqueClicks / memberStats.totalClicks) * 100) : 0
//         }
//       };
//     });

//     res.status(200).json({
//       success: true,
//       data: teamWithStats
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update team member role
// // @route   PUT /api/company/team/:userId/role
// // @access  Private/Company (Admin/Owner only)
// exports.updateTeamMemberRole = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const companyId = req.user.company;
//     const { userId } = req.params;
//     const { role } = req.body;

//     // FIX: Include 'owner' in allowed roles
//     if (!['admin', 'owner'].includes(req.user.companyRole)) {
//       await session.abortTransaction();
//       return res.status(403).json({
//         success: false,
//         message: 'Only company admins and owners can update team member roles'
//       });
//     }

//     // Prevent self-role change
//     if (userId === req.user.id) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot change your own role'
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

//     // Find and update team member
//     const teamMember = company.teamMembers.find(member => 
//       member.user.toString() === userId
//     );

//     if (!teamMember) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Team member not found'
//       });
//     }

//     teamMember.role = role;
//     await company.save({ session });

//     // Update user's company role
//     await User.findByIdAndUpdate(
//       userId,
//       { companyRole: role },
//       { session }
//     );

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       message: `Team member role updated to ${role}`,
//       data: teamMember
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Remove team member
// // @route   DELETE /api/company/team/:userId
// // @access  Private/Company (Admin/Owner only)
// exports.removeTeamMember = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const companyId = req.user.company;
//     const { userId } = req.params;

//     // FIX: Include 'owner' in allowed roles
//     if (!['admin', 'owner'].includes(req.user.companyRole)) {
//       await session.abortTransaction();
//       return res.status(403).json({
//         success: false,
//         message: 'Only company admins and owners can remove team members'
//       });
//     }

//     // Prevent self-removal
//     if (userId === req.user.id) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot remove yourself from the company'
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

//     // Remove team member
//     company.teamMembers = company.teamMembers.filter(member => 
//       member.user.toString() !== userId
//     );

//     await company.save({ session });

//     // Remove company reference from user
//     await User.findByIdAndUpdate(
//       userId,
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
//       message: 'Team member removed successfully',
//       data: { userId }
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get company financial overview
// // @route   GET /api/company/financials
// // @access  Private/Company
// exports.getFinancialOverview = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;

//     const financialData = await Gig.aggregate([
//       {
//         $match: { company: new mongoose.Types.ObjectId(companyId) }
//       },
//       {
//         $group: {
//           _id: null,
//           totalBudget: { $sum: '$budget' },
//           totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//           totalPlatformFees: { $sum: '$platformFee' },
//           activeGigsBudget: {
//             $sum: {
//               $cond: [{ $eq: ['$isActive', true] }, '$budget', 0]
//             }
//           },
//           completedGigsBudget: {
//             $sum: {
//               $cond: [{ $eq: ['$isActive', false] }, '$budget', 0]
//             }
//           },
//           gigCount: { $sum: 1 },
//           activeGigCount: {
//             $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     // Monthly spending
//     const monthlySpending = await Gig.aggregate([
//       {
//         $match: { company: new mongoose.Types.ObjectId(companyId) }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' }
//           },
//           spent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//           platformFees: { $sum: '$platformFee' },
//           gigCount: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.year': -1, '_id.month': -1 } },
//       { $limit: 12 }
//     ]);

//     const financialStats = financialData[0] || {
//       totalBudget: 0,
//       totalSpent: 0,
//       totalPlatformFees: 0,
//       activeGigsBudget: 0,
//       completedGigsBudget: 0,
//       gigCount: 0,
//       activeGigCount: 0
//     };

//     res.status(200).json({
//       success: true,
//       data: {
//         overview: {
//           ...financialStats,
//           remainingBudget: financialStats.totalBudget - financialStats.totalSpent,
//           avgCostPerGig: financialStats.gigCount > 0 ? 
//             financialStats.totalSpent / financialStats.gigCount : 0
//         },
//         monthlySpending,
//         currency: 'USD' // Assuming USD, you can make this dynamic
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get company invitations
// // @route   GET /api/company/invitations
// // @access  Private/Company
// exports.getCompanyInvitations = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
//     const { status = '', page = 1, limit = 20 } = req.query;
//     const skip = (page - 1) * limit;

//     let query = { company: companyId };

//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     const invitations = await Invitation.find(query)
//       .populate('sender', 'name email')
//       .populate('recipient', 'name email')
//       .populate('serviceGig', 'title price')
//       .populate('targetGig', 'title budget')
//       .sort({ sentAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Invitation.countDocuments(query);

//     // Invitation stats
//     const stats = await Invitation.aggregate([
//       { $match: { company: new mongoose.Types.ObjectId(companyId) } },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
//           accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
//           rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
//         }
//       }
//     ]);

//     const invitationStats = stats[0] || {
//       total: 0,
//       pending: 0,
//       accepted: 0,
//       rejected: 0
//     };

//     res.status(200).json({
//       success: true,
//       data: invitations,
//       stats: {
//         ...invitationStats,
//         acceptanceRate: invitationStats.total > 0 ?
//           Math.round((invitationStats.accepted / invitationStats.total) * 100) : 0
//       },
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

// // @desc    Send invitation to join company
// // @route   POST /api/company/invite
// // @access  Private/Company (Admin/Manager/Owner)
// exports.inviteToCompany = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const companyId = req.user.company;
//     const { email, role = 'member', message } = req.body;

//     // FIX: Include 'owner' in permissions
//     if (!['admin', 'manager', 'owner'].includes(req.user.companyRole)) {
//       await session.abortTransaction();
//       return res.status(403).json({
//         success: false,
//         message: 'Only admins, managers, and owners can invite users to the company'
//       });
//     }

//     // Find user by email
//     const user = await User.findOne({ email }).session(session);

//     if (!user) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'User not found with this email'
//       });
//     }

//     // Check if user already has a company
//     if (user.company) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'User is already part of another company'
//       });
//     }

//     // Check if user is already invited
//     const existingInvitation = await Invitation.findOne({
//       recipient: user._id,
//       company: companyId,
//       status: 'pending'
//     }).session(session);

//     if (existingInvitation) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'User has already been invited to join the company'
//       });
//     }

//     // Create company invitation
//     const invitation = await Invitation.create([{
//       sender: req.user.id,
//       senderType: 'company',
//       recipient: user._id,
//       company: companyId,
//       message: message || `You've been invited to join our company as a ${role}`,
//       compensation: null,
//       customOffer: { role },
//       status: 'pending'
//     }], { session });

//     await session.commitTransaction();

//     // TODO: Send email notification

//     res.status(201).json({
//       success: true,
//       message: 'Invitation sent successfully',
//       data: invitation[0]
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get company settings
// // @route   GET /api/company/settings
// // @access  Private/Company (Admin/Owner only)
// exports.getCompanySettings = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;

//     console.log('🔧 getCompanySettings controller called');
//     console.log('User companyRole in controller:', req.user.companyRole);
//     console.log('Allowed roles for settings:', ['admin', 'owner']);

//     // FIX: Include 'owner' in the allowed roles
//     if (!['admin', 'owner'].includes(req.user.companyRole)) {
//       console.log('❌ Access denied in controller. User role:', req.user.companyRole);
//       return res.status(403).json({
//         success: false,
//         message: 'Only company admins and owners can access settings'
//       });
//     }

//     const company = await Company.findById(companyId)
//       .select('companyName description website industry companySize address socialMedia logo verificationStatus createdAt');

//     if (!company) {
//       return res.status(404).json({
//         success: false,
//         message: 'Company not found'
//       });
//     }

//     console.log('✅ Settings access granted in controller');
//     res.status(200).json({
//       success: true,
//       data: company
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Export company data
// // @route   GET /api/company/export
// // @access  Private/Company
// exports.exportCompanyData = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
//     const { type = 'gigs' } = req.query;

//     let data;
//     let filename;

//     switch (type) {
//       case 'gigs':
//         data = await Gig.find({ company: companyId })
//           .populate('user', 'name email')
//           .select('-applications -approvedSharers');
//         filename = `company-gigs-${companyId}-${Date.now()}.json`;
//         break;

//       case 'shares':
//         data = await Share.find({ company: companyId })
//           .populate('gig', 'title')
//           .populate('user', 'name email');
//         filename = `company-shares-${companyId}-${Date.now()}.json`;
//         break;

//       case 'financials':
//         const financialData = await Gig.aggregate([
//           { $match: { company: new mongoose.Types.ObjectId(companyId) } },
//           {
//             $project: {
//               title: 1,
//               budget: 1,
//               spent: { $subtract: ['$budget', '$availableFunds'] },
//               platformFee: 1,
//               sharesCompleted: 1,
//               totalClicks: 1,
//               createdAt: 1,
//               isActive: 1
//             }
//           }
//         ]);
//         data = financialData;
//         filename = `company-financials-${companyId}-${Date.now()}.json`;
//         break;

//       default:
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid export type. Use: gigs, shares, or financials'
//         });
//     }

//     // Set headers for file download
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

//     res.status(200).json({
//       success: true,
//       data: data,
//       exportedAt: new Date(),
//       recordCount: data.length
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Register a new company
// // @route   POST /api/auth/company/register
// // @access  Private
// exports.registerCompany = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { companyName, description, website, industry, companySize, address } = req.body;
//     const userId = req.user.id;

//     // Check if user already has a company
//     if (req.user.company) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'User is already associated with a company'
//       });
//     }

//     // Create company
//     const company = await Company.create([{
//       companyName,
//       description,
//       website,
//       industry,
//       companySize,
//       address,
//       teamMembers: [{
//         user: userId,
//         role: 'owner', // Set as owner for company creator
//         joinedAt: new Date()
//       }]
//     }], { session });

//     // Update user with company reference
//     await User.findByIdAndUpdate(
//       userId,
//       { 
//         company: company[0]._id,
//         companyRole: 'owner' // Set as owner for company creator
//       },
//       { session }
//     );

//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       message: 'Company registered successfully',
//       data: company[0]
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get company stats (fallback method)
// // @route   GET /api/company/stats
// // @access  Private/Company
// exports.getCompanyStats = async (req, res, next) => {
//   try {
//     // Use dashboard data for now
//     const dashboardData = await this.getCompanyDashboard(req, res, next);
//     return dashboardData;
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get company analytics (fallback method)
// // @route   GET /api/company/analytics
// // @access  Private/Company
// exports.getCompanyAnalytics = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
    
//     const analytics = await Gig.aggregate([
//       {
//         $match: { company: new mongoose.Types.ObjectId(companyId) }
//       },
//       {
//         $group: {
//           _id: null,
//           totalGigs: { $sum: 1 },
//           activeGigs: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
//           totalBudget: { $sum: '$budget' },
//           totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
//           totalShares: { $sum: '$sharesCompleted' },
//           totalClicks: { $sum: '$totalClicks' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: analytics[0] || {
//         totalGigs: 0,
//         activeGigs: 0,
//         totalBudget: 0,
//         totalSpent: 0,
//         totalShares: 0,
//         totalClicks: 0
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get recent company gigs
// // @route   GET /api/company/recent-gigs
// // @access  Private/Company
// exports.getRecentCompanyGigs = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
    
//     const gigs = await Gig.find({ company: companyId })
//       .select('title budget contentType isActive sharesCompleted sharesRequired createdAt')
//       .sort({ createdAt: -1 })
//       .limit(10);

//     res.status(200).json({
//       success: true,
//       data: gigs
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get recent company shares
// // @route   GET /api/company/recent-shares
// // @access  Private/Company
// exports.getRecentCompanyShares = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
    
//     const shares = await Share.find({ company: companyId })
//       .populate('gig', 'title')
//       .populate('user', 'name')
//       .select('gig user submissionStatus amountEarned totalClicks createdAt')
//       .sort({ createdAt: -1 })
//       .limit(10);

//     res.status(200).json({
//       success: true,
//       data: shares
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get team performance
// // @route   GET /api/company/team-performance
// // @access  Private/Company
// exports.getTeamPerformance = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
    
//     const teamPerformance = await Share.aggregate([
//       { $match: { company: new mongoose.Types.ObjectId(companyId) } },
//       {
//         $group: {
//           _id: '$user',
//           totalShares: { $sum: 1 },
//           approvedShares: {
//             $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
//           },
//           totalEarnings: { $sum: '$amountEarned' },
//           totalClicks: { $sum: '$totalClicks' },
//           uniqueClicks: { $sum: '$uniqueClicks' }
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
//           userId: '$_id',
//           userName: '$user.name',
//           userEmail: '$user.email',
//           totalShares: 1,
//           approvedShares: 1,
//           approvalRate: {
//             $cond: [
//               { $gt: ['$totalShares', 0] },
//               { $multiply: [{ $divide: ['$approvedShares', '$totalShares'] }, 100] },
//               0
//             ]
//           },
//           totalEarnings: 1,
//           totalClicks: 1,
//           uniqueClicks: 1,
//           clickThroughRate: {
//             $cond: [
//               { $gt: ['$totalClicks', 0] },
//               { $multiply: [{ $divide: ['$uniqueClicks', '$totalClicks'] }, 100] },
//               0
//             ]
//           }
//         }
//       },
//       { $sort: { totalShares: -1 } }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: teamPerformance
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get company earnings
// // @route   GET /api/company/earnings
// // @access  Private/Company
// exports.getCompanyEarnings = async (req, res, next) => {
//   try {
//     const companyId = req.user.company;
    
//     const earnings = await Share.aggregate([
//       { $match: { company: new mongoose.Types.ObjectId(companyId) } },
//       {
//         $group: {
//           _id: null,
//           totalEarnings: { $sum: '$amountEarned' },
//           totalShares: { $sum: 1 },
//           averageEarnings: { $avg: '$amountEarned' }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       data: earnings[0] || {
//         totalEarnings: 0,
//         totalShares: 0,
//         averageEarnings: 0
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get team members (alias for getCompanyTeam)
// // @route   GET /api/company/team-members
// // @access  Private/Company
// exports.getTeamMembers = async (req, res, next) => {
//   // Simply call the existing getCompanyTeam method
//   return this.getCompanyTeam(req, res, next);
// };

// // @desc    Get invitations (alias for getCompanyInvitations)
// // @route   GET /api/company/invites
// // @access  Private/Company
// exports.getInvitations = async (req, res, next) => {
//   // Simply call the existing getCompanyInvitations method
//   return this.getCompanyInvitations(req, res, next);
// };



// controllers/company.js
const Company = require('../models/Company');
const User = require('../models/User');
const Gig = require('../models/Gig');
const Share = require('../models/Share');
const Application = require('../models/Application');
const Invitation = require('../models/Invitation');
const NotificationService = require('../utils/notificationService');
const mongoose = require('mongoose');

// @desc    Get company dashboard data
// @route   GET /api/company/dashboard
// @access  Private/Company
exports.getCompanyDashboard = async (req, res, next) => {
  try {
    const companyId = req.user.company;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'User is not associated with any company'
      });
    }

    console.log('🔍 Company ID:', companyId);
    console.log('🔍 User company role:', req.user.companyRole);

    const company = await Company.findById(companyId)
      .populate('teamMembers.user', 'name email role lastLogin');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get all team member user IDs
    const teamMemberIds = company.teamMembers.map(member => member.user._id);
    console.log('🔍 Team member IDs:', teamMemberIds);

    // Get gigs created by any team member of this company
    const [
      totalGigs,
      activeGigs,
      completedGigs,
      totalShares,
      approvedShares,
      totalSpent,
      pendingInvitations,
      teamPerformance,
      recentGigs,
      recentShares
    ] = await Promise.all([
      // Gig stats - query by user IDs in the company
      Gig.countDocuments({ user: { $in: teamMemberIds } }).catch(err => {
        console.error('❌ Error counting total gigs:', err);
        return 0;
      }),
      Gig.countDocuments({ 
        user: { $in: teamMemberIds }, 
        isActive: true 
      }).catch(err => {
        console.error('❌ Error counting active gigs:', err);
        return 0;
      }),
      Gig.countDocuments({ 
        user: { $in: teamMemberIds }, 
        isActive: false 
      }).catch(err => {
        console.error('❌ Error counting completed gigs:', err);
        return 0;
      }),
      
      // Share stats - query by company ID (assuming Share model has company field)
      Share.countDocuments({ company: companyId }).catch(err => {
        console.error('❌ Error counting total shares:', err);
        return 0;
      }),
      Share.countDocuments({ 
        company: companyId, 
        submissionStatus: 'approved' 
      }).catch(err => {
        console.error('❌ Error counting approved shares:', err);
        return 0;
      }),
      
      // Financial stats - aggregate by user IDs in the company
      Gig.aggregate([
        { $match: { user: { $in: teamMemberIds } } },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
            totalBudget: { $sum: '$budget' },
            platformFees: { $sum: '$platformFee' }
          }
        }
      ]).catch(err => {
        console.error('❌ Error in financial aggregation:', err);
        return [{}];
      }),
      
      // Invitation stats
      Invitation.countDocuments({ 
        company: companyId,
        status: 'pending'
      }).catch(err => {
        console.error('❌ Error counting pending invitations:', err);
        return 0;
      }),
      
      // Team performance
      Share.aggregate([
        { $match: { company: new mongoose.Types.ObjectId(companyId) } },
        {
          $group: {
            _id: '$user',
            totalShares: { $sum: 1 },
            approvedShares: {
              $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
            },
            totalEarnings: { $sum: '$amountEarned' },
            totalClicks: { $sum: '$totalClicks' },
            uniqueClicks: { $sum: '$uniqueClicks' }
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
            userId: '$_id',
            userName: '$user.name',
            userEmail: '$user.email',
            totalShares: 1,
            approvedShares: 1,
            approvalRate: {
              $cond: [
                { $gt: ['$totalShares', 0] },
                { $multiply: [{ $divide: ['$approvedShares', '$totalShares'] }, 100] },
                0
              ]
            },
            totalEarnings: 1,
            totalClicks: 1,
            uniqueClicks: 1,
            clickThroughRate: {
              $cond: [
                { $gt: ['$totalClicks', 0] },
                { $multiply: [{ $divide: ['$uniqueClicks', '$totalClicks'] }, 100] },
                0
              ]
            }
          }
        },
        { $sort: { totalShares: -1 } }
      ]).catch(err => {
        console.error('❌ Error in team performance aggregation:', err);
        return [];
      }),

      // Recent gigs - get gigs from company team members
      Gig.find({ user: { $in: teamMemberIds } })
        .select('title budget contentType isActive sharesCompleted sharesRequired createdAt')
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .catch(err => {
          console.error('❌ Error fetching recent gigs:', err);
          return [];
        }),

      // Recent shares
      Share.find({ company: companyId })
        .populate('gig', 'title')
        .populate('user', 'name')
        .select('gig user submissionStatus amountEarned totalClicks createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
        .catch(err => {
          console.error('❌ Error fetching recent shares:', err);
          return [];
        })
    ]);

    const financialStats = totalSpent[0] || {
      totalSpent: 0,
      totalBudget: 0,
      platformFees: 0
    };

    console.log('✅ Total gigs found:', totalGigs);
    console.log('✅ Recent gigs:', recentGigs.length);

    res.status(200).json({
      success: true,
      data: {
        company,
        stats: {
          totalGigs,
          activeGigs,
          completedGigs,
          totalShares,
          approvedShares,
          pendingInvitations,
          financial: {
            totalSpent: financialStats.totalSpent,
            totalBudget: financialStats.totalBudget,
            platformFees: financialStats.platformFees,
            remainingBudget: financialStats.totalBudget - financialStats.totalSpent
          },
          approvalRate: totalShares > 0 ? Math.round((approvedShares / totalShares) * 100) : 0
        },
        teamPerformance,
        recentActivity: {
          gigs: recentGigs,
          shares: recentShares
        }
      }
    });
  } catch (error) {
    console.error('❌ Error in getCompanyDashboard:', error);
    next(error);
  }
};

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private/Company
exports.getCompanyProfile = async (req, res, next) => {
  try {
    const companyId = req.user.company;

    const company = await Company.findById(companyId)
      .populate('teamMembers.user', 'name email role avatar lastLogin');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private/Company (Admin/Manager/Owner roles)
exports.updateCompanyProfile = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.user.company;
    const userRole = req.user.companyRole;

    // FIX: Include 'owner' in allowed roles
    if (!['admin', 'manager', 'owner'].includes(userRole)) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only company admins, managers, and owners can update company profile'
      });
    }

    const {
      companyName,
      description,
      website,
      industry,
      companySize,
      address,
      socialMedia,
      logo
    } = req.body;

    const company = await Company.findById(companyId).session(session);

    if (!company) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Update allowed fields
    const updateFields = {};
    if (companyName) updateFields.companyName = companyName;
    if (description) updateFields.description = description;
    if (website) updateFields.website = website;
    if (industry) updateFields.industry = industry;
    if (companySize) updateFields.companySize = companySize;
    if (address) updateFields.address = address;
    if (socialMedia) updateFields.socialMedia = socialMedia;
    if (logo) updateFields.logo = logo;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateFields,
      { new: true, session }
    ).populate('teamMembers.user', 'name email role');

    // 🔔 NOTIFICATION: Company Profile Updated
    try {
      // Notify all team members about profile update
      for (const member of company.teamMembers) {
        await NotificationService.createNotification({
          userId: member.user._id,
          type: 'system_announcement',
          title: 'Company Profile Updated',
          message: `Company profile for "${company.companyName}" has been updated by ${req.user.name}.`,
          data: {
            companyId: company._id,
            companyName: company.companyName,
            updatedBy: req.user.id,
            metadata: {
              updatedFields: Object.keys(updateFields),
              updatedAt: new Date()
            }
          },
          priority: 'low'
        });
      }
    } catch (notifyError) {
      console.error('Company profile update notifications failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      data: updatedCompany
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get company gigs
// @route   GET /api/company/gigs
// @access  Private/Company
exports.getCompanyGigs = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { 
      status = '', 
      search = '', 
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Get company team members
    const company = await Company.findById(companyId).select('teamMembers');
    const teamMemberIds = company.teamMembers.map(member => member.user);

    // Build query - gigs created by company team members
    let query = { user: { $in: teamMemberIds } };

    // Status filter
    if (status && status !== 'all') {
      if (status === 'active') {
        query.isActive = true;
      } else if (status === 'completed') {
        query.isActive = false;
      } else if (status === 'draft') {
        query.status = 'draft';
      }
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const gigs = await Gig.find(query)
      .select('-applications -approvedSharers')
      .populate('user', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gig.countDocuments(query);

    // Get gig performance stats
    const gigStats = await Gig.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          totalSharesCompleted: { $sum: '$sharesCompleted' },
          totalClicks: { $sum: '$totalClicks' },
          avgCompletionRate: {
            $avg: {
              $multiply: [{ $divide: ['$sharesCompleted', '$sharesRequired'] }, 100]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: gigs,
      stats: gigStats[0] || {
        totalBudget: 0,
        totalSpent: 0,
        totalSharesCompleted: 0,
        totalClicks: 0,
        avgCompletionRate: 0
      },
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

// @desc    Get company gig performance analytics
// @route   GET /api/company/gigs/analytics
// @access  Private/Company
exports.getGigAnalytics = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { period = '30d' } = req.query;

    // Calculate date range
    const dateRange = new Date();
    if (period === '7d') {
      dateRange.setDate(dateRange.getDate() - 7);
    } else if (period === '30d') {
      dateRange.setDate(dateRange.getDate() - 30);
    } else if (period === '90d') {
      dateRange.setDate(dateRange.getDate() - 90);
    } else {
      dateRange.setDate(dateRange.getDate() - 30); // Default 30 days
    }

    const analytics = await Gig.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          gigsCreated: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          sharesCompleted: { $sum: '$sharesCompleted' },
          totalClicks: { $sum: '$totalClicks' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Performance by content type
    const performanceByType = await Gig.aggregate([
      {
        $match: {
          company: new mongoose.Types.ObjectId(companyId),
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: '$contentType',
          totalGigs: { $sum: 1 },
          completedGigs: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          },
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          totalShares: { $sum: '$sharesCompleted' },
          totalClicks: { $sum: '$totalClicks' },
          avgCompletionRate: {
            $avg: {
              $multiply: [{ $divide: ['$sharesCompleted', '$sharesRequired'] }, 100]
            }
          },
          avgCostPerShare: {
            $avg: {
              $cond: [
                { $gt: ['$sharesCompleted', 0] },
                { $divide: [{ $subtract: ['$budget', '$availableFunds'] }, '$sharesCompleted'] },
                0
              ]
            }
          }
        }
      },
      { $sort: { totalGigs: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        timeline: analytics,
        performanceByType,
        period
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company shares
// @route   GET /api/company/shares
// @access  Private/Company
exports.getCompanyShares = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { 
      status = '', 
      gig = '', 
      user = '', 
      page = 1, 
      limit = 50 
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build query
    let query = { company: companyId };

    // Status filter
    if (status && status !== 'all') {
      query.submissionStatus = status;
    }

    // Gig filter
    if (gig) {
      query.gig = gig;
    }

    // User filter
    if (user) {
      query.user = user;
    }

    const shares = await Share.find(query)
      .populate('gig', 'title budget contentType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Share.countDocuments(query);

    // Share performance stats
    const shareStats = await Share.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalShares: { $sum: 1 },
          approvedShares: {
            $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
          },
          pendingShares: {
            $sum: { $cond: [{ $eq: ['$submissionStatus', 'pending'] }, 1, 0] }
          },
          rejectedShares: {
            $sum: { $cond: [{ $eq: ['$submissionStatus', 'rejected'] }, 1, 0] }
          },
          totalEarnings: { $sum: '$amountEarned' },
          totalClicks: { $sum: '$totalClicks' },
          uniqueClicks: { $sum: '$uniqueClicks' }
        }
      }
    ]);

    const stats = shareStats[0] || {
      totalShares: 0,
      approvedShares: 0,
      pendingShares: 0,
      rejectedShares: 0,
      totalEarnings: 0,
      totalClicks: 0,
      uniqueClicks: 0
    };

    res.status(200).json({
      success: true,
      data: shares,
      stats: {
        ...stats,
        approvalRate: stats.totalShares > 0 ? Math.round((stats.approvedShares / stats.totalShares) * 100) : 0,
        clickThroughRate: stats.totalClicks > 0 ? Math.round((stats.uniqueClicks / stats.totalClicks) * 100) : 0
      },
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

// @desc    Get company team members
// @route   GET /api/company/team
// @access  Private/Company
exports.getCompanyTeam = async (req, res, next) => {
  try {
    const companyId = req.user.company;

    const company = await Company.findById(companyId)
      .populate('teamMembers.user', 'name email avatar role lastLogin')
      .select('teamMembers');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get team performance stats
    const teamStats = await Share.aggregate([
      {
        $match: { company: new mongoose.Types.ObjectId(companyId) }
      },
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
          lastActivity: { $max: '$createdAt' }
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
      { $unwind: '$user' }
    ]);

    // Merge team members with their stats
    const teamWithStats = company.teamMembers.map(member => {
      const memberStats = teamStats.find(stat => 
        stat._id.toString() === member.user._id.toString()
      ) || {
        totalShares: 0,
        approvedShares: 0,
        totalEarnings: 0,
        totalClicks: 0,
        uniqueClicks: 0,
        lastActivity: null
      };

      return {
        ...member.toObject(),
        stats: {
          ...memberStats,
          approvalRate: memberStats.totalShares > 0 ? 
            Math.round((memberStats.approvedShares / memberStats.totalShares) * 100) : 0,
          clickThroughRate: memberStats.totalClicks > 0 ?
            Math.round((memberStats.uniqueClicks / memberStats.totalClicks) * 100) : 0
        }
      };
    });

    res.status(200).json({
      success: true,
      data: teamWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member role
// @route   PUT /api/company/team/:userId/role
// @access  Private/Company (Admin/Owner only)
exports.updateTeamMemberRole = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.user.company;
    const { userId } = req.params;
    const { role } = req.body;

    // FIX: Include 'owner' in allowed roles
    if (!['admin', 'owner'].includes(req.user.companyRole)) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only company admins and owners can update team member roles'
      });
    }

    // Prevent self-role change
    if (userId === req.user.id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
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

    // Find and update team member
    const teamMember = company.teamMembers.find(member => 
      member.user.toString() === userId
    );

    if (!teamMember) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const previousRole = teamMember.role;
    teamMember.role = role;
    await company.save({ session });

    // Update user's company role
    await User.findByIdAndUpdate(
      userId,
      { companyRole: role },
      { session }
    );

    // 🔔 NOTIFICATION: Team Member Role Updated
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Role Updated',
        message: `Your role in "${company.companyName}" has been updated from ${previousRole} to ${role} by ${req.user.name}.`,
        data: {
          companyId: company._id,
          companyName: company.companyName,
          previousRole: previousRole,
          newRole: role,
          updatedBy: req.user.id,
          metadata: {
            updatedBy: req.user.name,
            updatedAt: new Date()
          }
        },
        priority: 'medium'
      });

      // Notify other admins about the role change
      for (const member of company.teamMembers) {
        if (['admin', 'owner'].includes(member.role) && member.user.toString() !== req.user.id) {
          await NotificationService.createNotification({
            userId: member.user._id,
            type: 'system_announcement',
            title: 'Team Member Role Updated',
            message: `${req.user.name} updated ${teamMember.user.name}'s role to ${role} in ${company.companyName}.`,
            data: {
              companyId: company._id,
              companyName: company.companyName,
              teamMemberId: userId,
              previousRole: previousRole,
              newRole: role,
              metadata: {
                updatedBy: req.user.name,
                updatedAt: new Date()
              }
            },
            priority: 'low'
          });
        }
      }
    } catch (notifyError) {
      console.error('Team member role update notifications failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `Team member role updated to ${role}`,
      data: teamMember
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Remove team member
// @route   DELETE /api/company/team/:userId
// @access  Private/Company (Admin/Owner only)
exports.removeTeamMember = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.user.company;
    const { userId } = req.params;

    // FIX: Include 'owner' in allowed roles
    if (!['admin', 'owner'].includes(req.user.companyRole)) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only company admins and owners can remove team members'
      });
    }

    // Prevent self-removal
    if (userId === req.user.id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot remove yourself from the company'
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

    // Get team member info before removal
    const removedMember = company.teamMembers.find(member => 
      member.user.toString() === userId
    );

    if (!removedMember) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Remove team member
    company.teamMembers = company.teamMembers.filter(member => 
      member.user.toString() !== userId
    );

    await company.save({ session });

    // Remove company reference from user
    await User.findByIdAndUpdate(
      userId,
      { 
        $unset: { 
          company: 1,
          companyRole: 1
        }
      },
      { session }
    );

    // 🔔 NOTIFICATION: Team Member Removed
    try {
      // Notify the removed user
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Removed from Company',
        message: `You have been removed from "${company.companyName}" by ${req.user.name}.`,
        data: {
          companyId: company._id,
          companyName: company.companyName,
          removedBy: req.user.id,
          metadata: {
            removedAt: new Date(),
            removedBy: req.user.name
          }
        },
        priority: 'high'
      });

      // Notify other team members about the removal
      for (const member of company.teamMembers) {
        if (member.user.toString() !== req.user.id) {
          await NotificationService.createNotification({
            userId: member.user._id,
            type: 'system_announcement',
            title: 'Team Member Removed',
            message: `${removedMember.user.name} has been removed from ${company.companyName} by ${req.user.name}.`,
            data: {
              companyId: company._id,
              companyName: company.companyName,
              removedMemberId: userId,
              metadata: {
                removedAt: new Date(),
                removedBy: req.user.name
              }
            },
            priority: 'medium'
          });
        }
      }
    } catch (notifyError) {
      console.error('Team member removal notifications failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
      data: { userId }
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get company financial overview
// @route   GET /api/company/financials
// @access  Private/Company
exports.getFinancialOverview = async (req, res, next) => {
  try {
    const companyId = req.user.company;

    const financialData = await Gig.aggregate([
      {
        $match: { company: new mongoose.Types.ObjectId(companyId) }
      },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          totalPlatformFees: { $sum: '$platformFee' },
          activeGigsBudget: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, '$budget', 0]
            }
          },
          completedGigsBudget: {
            $sum: {
              $cond: [{ $eq: ['$isActive', false] }, '$budget', 0]
            }
          },
          gigCount: { $sum: 1 },
          activeGigCount: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    // Monthly spending
    const monthlySpending = await Gig.aggregate([
      {
        $match: { company: new mongoose.Types.ObjectId(companyId) }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          spent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          platformFees: { $sum: '$platformFee' },
          gigCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const financialStats = financialData[0] || {
      totalBudget: 0,
      totalSpent: 0,
      totalPlatformFees: 0,
      activeGigsBudget: 0,
      completedGigsBudget: 0,
      gigCount: 0,
      activeGigCount: 0
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          ...financialStats,
          remainingBudget: financialStats.totalBudget - financialStats.totalSpent,
          avgCostPerGig: financialStats.gigCount > 0 ? 
            financialStats.totalSpent / financialStats.gigCount : 0
        },
        monthlySpending,
        currency: 'USD'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company invitations
// @route   GET /api/company/invitations
// @access  Private/Company
exports.getCompanyInvitations = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { status = '', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { company: companyId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const invitations = await Invitation.find(query)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .populate('serviceGig', 'title price')
      .populate('targetGig', 'title budget')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invitation.countDocuments(query);

    // Invitation stats
    const stats = await Invitation.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
        }
      }
    ]);

    const invitationStats = stats[0] || {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    res.status(200).json({
      success: true,
      data: invitations,
      stats: {
        ...invitationStats,
        acceptanceRate: invitationStats.total > 0 ?
          Math.round((invitationStats.accepted / invitationStats.total) * 100) : 0
      },
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

// @desc    Send invitation to join company
// @route   POST /api/company/invite
// @access  Private/Company (Admin/Manager/Owner)
exports.inviteToCompany = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyId = req.user.company;
    const { email, role = 'member', message } = req.body;

    // FIX: Include 'owner' in permissions
    if (!['admin', 'manager', 'owner'].includes(req.user.companyRole)) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Only admins, managers, and owners can invite users to the company'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).session(session);

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Check if user already has a company
    if (user.company) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'User is already part of another company'
      });
    }

    // Check if user is already invited
    const existingInvitation = await Invitation.findOne({
      recipient: user._id,
      company: companyId,
      status: 'pending'
    }).session(session);

    if (existingInvitation) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'User has already been invited to join the company'
      });
    }

    // Create company invitation
    const invitation = await Invitation.create([{
      sender: req.user.id,
      senderType: 'company',
      recipient: user._id,
      company: companyId,
      message: message || `You've been invited to join our company as a ${role}`,
      compensation: null,
      customOffer: { role },
      status: 'pending'
    }], { session });

    // 🔔 NOTIFICATION: Company Invitation Sent
    try {
      await NotificationService.createNotification({
        userId: user._id,
        type: 'system_announcement',
        title: 'Company Invitation',
        message: `You have been invited to join "${req.user.companyName}" as a ${role}.`,
        data: {
          invitationId: invitation[0]._id,
          companyId: companyId,
          companyName: req.user.companyName,
          role: role,
          senderId: req.user.id,
          metadata: {
            invitedBy: req.user.name,
            role: role,
            sentAt: new Date()
          }
        },
        priority: 'medium'
      });

      // Notify other admins about the invitation
      const company = await Company.findById(companyId).session(session);
      for (const member of company.teamMembers) {
        if (['admin', 'owner'].includes(member.role) && member.user.toString() !== req.user.id) {
          await NotificationService.createNotification({
            userId: member.user._id,
            type: 'system_announcement',
            title: 'New Company Invitation',
            message: `${req.user.name} invited ${email} to join ${company.companyName} as ${role}.`,
            data: {
              invitationId: invitation[0]._id,
              companyId: companyId,
              invitedUserEmail: email,
              role: role,
              metadata: {
                invitedBy: req.user.name,
                invitedAt: new Date()
              }
            },
            priority: 'low'
          });
        }
      }
    } catch (notifyError) {
      console.error('Company invitation notifications failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: invitation[0]
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get company settings
// @route   GET /api/company/settings
// @access  Private/Company (Admin/Owner only)
exports.getCompanySettings = async (req, res, next) => {
  try {
    const companyId = req.user.company;

    console.log('🔧 getCompanySettings controller called');
    console.log('User companyRole in controller:', req.user.companyRole);
    console.log('Allowed roles for settings:', ['admin', 'owner']);

    // FIX: Include 'owner' in the allowed roles
    if (!['admin', 'owner'].includes(req.user.companyRole)) {
      console.log('❌ Access denied in controller. User role:', req.user.companyRole);
      return res.status(403).json({
        success: false,
        message: 'Only company admins and owners can access settings'
      });
    }

    const company = await Company.findById(companyId)
      .select('companyName description website industry companySize address socialMedia logo verificationStatus createdAt');

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    console.log('✅ Settings access granted in controller');
    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export company data
// @route   GET /api/company/export
// @access  Private/Company
exports.exportCompanyData = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    const { type = 'gigs' } = req.query;

    let data;
    let filename;

    switch (type) {
      case 'gigs':
        data = await Gig.find({ company: companyId })
          .populate('user', 'name email')
          .select('-applications -approvedSharers');
        filename = `company-gigs-${companyId}-${Date.now()}.json`;
        break;

      case 'shares':
        data = await Share.find({ company: companyId })
          .populate('gig', 'title')
          .populate('user', 'name email');
        filename = `company-shares-${companyId}-${Date.now()}.json`;
        break;

      case 'financials':
        const financialData = await Gig.aggregate([
          { $match: { company: new mongoose.Types.ObjectId(companyId) } },
          {
            $project: {
              title: 1,
              budget: 1,
              spent: { $subtract: ['$budget', '$availableFunds'] },
              platformFee: 1,
              sharesCompleted: 1,
              totalClicks: 1,
              createdAt: 1,
              isActive: 1
            }
          }
        ]);
        data = financialData;
        filename = `company-financials-${companyId}-${Date.now()}.json`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type. Use: gigs, shares, or financials'
        });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    res.status(200).json({
      success: true,
      data: data,
      exportedAt: new Date(),
      recordCount: data.length
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Register a new company
// @route   POST /api/auth/company/register
// @access  Private
exports.registerCompany = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { companyName, description, website, industry, companySize, address } = req.body;
    const userId = req.user.id;

    // Check if user already has a company
    if (req.user.company) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'User is already associated with a company'
      });
    }

    // Create company
    const company = await Company.create([{
      companyName,
      description,
      website,
      industry,
      companySize,
      address,
      teamMembers: [{
        user: userId,
        role: 'owner', // Set as owner for company creator
        joinedAt: new Date()
      }]
    }], { session });

    // Update user with company reference
    await User.findByIdAndUpdate(
      userId,
      { 
        company: company[0]._id,
        companyRole: 'owner' // Set as owner for company creator
      },
      { session }
    );

    // 🔔 NOTIFICATION: Company Registered
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Company Registered',
        message: `Your company "${companyName}" has been successfully registered and is pending verification.`,
        data: {
          companyId: company[0]._id,
          companyName: companyName,
          metadata: {
            registeredAt: new Date(),
            status: 'pending'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Company registration notification failed:', notifyError);
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: company[0]
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get company stats (fallback method)
// @route   GET /api/company/stats
// @access  Private/Company
exports.getCompanyStats = async (req, res, next) => {
  try {
    // Use dashboard data for now
    const dashboardData = await this.getCompanyDashboard(req, res, next);
    return dashboardData;
  } catch (error) {
    next(error);
  }
};

// @desc    Get company analytics (fallback method)
// @route   GET /api/company/analytics
// @access  Private/Company
exports.getCompanyAnalytics = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    
    const analytics = await Gig.aggregate([
      {
        $match: { company: new mongoose.Types.ObjectId(companyId) }
      },
      {
        $group: {
          _id: null,
          totalGigs: { $sum: 1 },
          activeGigs: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          totalShares: { $sum: '$sharesCompleted' },
          totalClicks: { $sum: '$totalClicks' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: analytics[0] || {
        totalGigs: 0,
        activeGigs: 0,
        totalBudget: 0,
        totalSpent: 0,
        totalShares: 0,
        totalClicks: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent company gigs
// @route   GET /api/company/recent-gigs
// @access  Private/Company
exports.getRecentCompanyGigs = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    
    const gigs = await Gig.find({ company: companyId })
      .select('title budget contentType isActive sharesCompleted sharesRequired createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: gigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent company shares
// @route   GET /api/company/recent-shares
// @access  Private/Company
exports.getRecentCompanyShares = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    
    const shares = await Share.find({ company: companyId })
      .populate('gig', 'title')
      .populate('user', 'name')
      .select('gig user submissionStatus amountEarned totalClicks createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: shares
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team performance
// @route   GET /api/company/team-performance
// @access  Private/Company
exports.getTeamPerformance = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    
    const teamPerformance = await Share.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$user',
          totalShares: { $sum: 1 },
          approvedShares: {
            $sum: { $cond: [{ $eq: ['$submissionStatus', 'approved'] }, 1, 0] }
          },
          totalEarnings: { $sum: '$amountEarned' },
          totalClicks: { $sum: '$totalClicks' },
          uniqueClicks: { $sum: '$uniqueClicks' }
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
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          totalShares: 1,
          approvedShares: 1,
          approvalRate: {
            $cond: [
              { $gt: ['$totalShares', 0] },
              { $multiply: [{ $divide: ['$approvedShares', '$totalShares'] }, 100] },
              0
            ]
          },
          totalEarnings: 1,
          totalClicks: 1,
          uniqueClicks: 1,
          clickThroughRate: {
            $cond: [
              { $gt: ['$totalClicks', 0] },
              { $multiply: [{ $divide: ['$uniqueClicks', '$totalClicks'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalShares: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: teamPerformance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company earnings
// @route   GET /api/company/earnings
// @access  Private/Company
exports.getCompanyEarnings = async (req, res, next) => {
  try {
    const companyId = req.user.company;
    
    const earnings = await Share.aggregate([
      { $match: { company: new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amountEarned' },
          totalShares: { $sum: 1 },
          averageEarnings: { $avg: '$amountEarned' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: earnings[0] || {
        totalEarnings: 0,
        totalShares: 0,
        averageEarnings: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team members (alias for getCompanyTeam)
// @route   GET /api/company/team-members
// @access  Private/Company
exports.getTeamMembers = async (req, res, next) => {
  // Simply call the existing getCompanyTeam method
  return this.getCompanyTeam(req, res, next);
};

// @desc    Get invitations (alias for getCompanyInvitations)
// @route   GET /api/company/invites
// @access  Private/Company
exports.getInvitations = async (req, res, next) => {
  // Simply call the existing getCompanyInvitations method
  return this.getCompanyInvitations(req, res, next);
};