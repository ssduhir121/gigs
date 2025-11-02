// controllers/admin.js
const User = require('../models/User');
const Gig = require('../models/Gig');
const Share = require('../models/Share');
const Transaction = require('../models/Transaction');

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalGigs,
      totalShares,
      adminUser
    ] = await Promise.all([
      User.countDocuments(),
      Gig.countDocuments(),
      Share.countDocuments(),
      User.findOne({ role: 'admin' })
    ]);

    // Calculate total platform revenue from shares
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
        adminBalance: adminUser?.walletBalance || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Other admin controller methods remain the same...
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

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