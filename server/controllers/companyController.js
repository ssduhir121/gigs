const Company = require('../models/Company');
const User = require('../models/User');
const Gig = require('../models/Gig');

const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // ✅ ADD THIS IMPORT


// @desc    Register company (public - creates both company and user)
// @route   POST /api/company/register
// @access  Public
exports.registerCompany = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();

    const {
      // Company fields
      companyName,
      businessEmail,
      website,
      industry,
      companySize,
      taxId,
      
      // Contact person fields (will become the owner)
      contactPersonName,
      contactPersonPosition,
      contactPersonPhone,
      contactPersonEmail, // This becomes the user email
      contactPersonPassword, // For user account
      
      // Address
      address
    } = req.body;

    console.log('Received registration data:', {
      companyName,
      businessEmail,
      contactPersonName,
      contactPersonEmail,
      address
    });

    // Check if company already exists
    const companyExists = await Company.findOne({ 
      $or: [{ businessEmail }, { companyName }] 
    }).session(session);

    if (companyExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'Company already exists with this email or name'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: contactPersonEmail }).session(session);
    if (userExists) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists. Please login first.'
      });
    }

    // Create user account (the company owner)
    const user = await User.create([{
      name: contactPersonName,
      email: contactPersonEmail,
      password: contactPersonPassword,
      role: 'user', // Regular user role
      isVerified: true // Auto-verify for company registration
    }], { session });

    // Create company
    const company = await Company.create([{
      companyName,
      businessEmail,
      website,
      industry,
      companySize,
      taxId,
      address,
      contactPerson: {
        name: contactPersonName,
        position: contactPersonPosition,
        phone: contactPersonPhone,
        email: contactPersonEmail
      },
      teamMembers: [{
        user: user[0]._id,
        role: 'owner',
        permissions: ['all'],
        status: 'active',
        joinedAt: new Date()
      }]
    }], { session });

    // Update user with company info
    await User.findByIdAndUpdate(
      user[0]._id,
      { 
        company: company[0]._id,
        companyRole: 'owner'
      },
      { session }
    );

    // ✅ Commit transaction FIRST
    await session.commitTransaction();
    
    // ✅ End session BEFORE generating response
    session.endSession();

    // Generate token for immediate login
    const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log('Company registration successful:', {
      companyId: company[0]._id,
      userId: user[0]._id
    });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully!',
      token,
      data: {
        company: company[0],
        user: {
          id: user[0]._id,
          name: user[0].name,
          email: user[0].email,
          company: company[0]._id,
          companyRole: 'owner'
        }
      }
    });

  } catch (error) {
    // ✅ Handle errors properly
    console.error('Registration error:', error);
    
    // Only abort if session is still active and transaction not committed
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    
    // Handle specific errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Company or user with this email already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};


// @desc    Get company dashboard
// @route   GET /api/company/dashboard
// @access  Private/Company
exports.getCompanyDashboard = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company)
      .populate('teamMembers.user', 'name email lastLogin')
      .populate({
        path: 'teamMembers.user',
        select: 'name email lastLogin'
      });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get company gigs stats
    const teamUserIds = company.teamMembers.map(member => member.user._id);
    
    const gigsStats = await Gig.aggregate([
      { $match: { user: { $in: teamUserIds } } },
      {
        $group: {
          _id: null,
          totalGigs: { $sum: 1 },
          activeGigs: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          totalBudget: { $sum: '$budget' },
          totalSpent: { $sum: { $subtract: ['$budget', '$availableFunds'] } },
          sharesCompleted: { $sum: '$sharesCompleted' }
        }
      }
    ]);

    const stats = gigsStats[0] || {
      totalGigs: 0,
      activeGigs: 0,
      totalBudget: 0,
      totalSpent: 0,
      sharesCompleted: 0
    };

    res.status(200).json({
      success: true,
      data: {
        company,
        stats,
        teamMembers: company.teamMembers.length,
        activeMembers: company.teamMembers.filter(m => m.status === 'active').length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Invite team member
// @route   POST /api/company/team/invite
// @access  Private/CompanyAdmin
exports.inviteTeamMember = async (req, res, next) => {
  try {
    const { email, role = 'member' } = req.body;
    const companyId = req.user.company;

    // Check if user exists
    let user = await User.findOne({ email });
    let newUser = false;

    if (!user) {
      // Create new user account
      const tempPassword = crypto.randomBytes(8).toString('hex');
      user = await User.create({
        name: email.split('@')[0], // Default name from email
        email,
        password: tempPassword,
        isVerified: false
      });
      newUser = true;

      // TODO: Send invitation email with temp password
    } else {
      // Check if user already in a company
      if (user.company && user.company.toString() !== companyId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'User already belongs to another company'
        });
      }
    }

    // Add to company team
    const company = await Company.findById(companyId);
    const alreadyMember = company.teamMembers.some(member => 
      member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member'
      });
    }

    company.teamMembers.push({
      user: user._id,
      role,
      permissions: getDefaultPermissions(role),
      status: 'pending'
    });

    await company.save();

    // Update user company reference if new
    if (!user.company) {
      user.company = companyId;
      user.companyRole = role;
      await user.save();
    }

    // TODO: Send invitation email

    res.status(200).json({
      success: true,
      message: `Team member invited ${newUser ? '(new user created)' : ''}`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        role,
        status: 'pending'
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update team member role
// @route   PUT /api/company/team/:userId/role
// @access  Private/CompanyAdmin
exports.updateTeamMemberRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const companyId = req.user.company;

    const company = await Company.findById(companyId);
    const teamMember = company.teamMembers.find(member => 
      member.user.toString() === userId
    );

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    teamMember.role = role;
    teamMember.permissions = getDefaultPermissions(role);
    await company.save();

    // Update user role
    await User.findByIdAndUpdate(userId, { companyRole: role });

    res.status(200).json({
      success: true,
      message: 'Team member role updated',
      data: teamMember
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove team member
// @route   DELETE /api/company/team/:userId
// @access  Private/CompanyAdmin
exports.removeTeamMember = async (req, res, next) => {
  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    await session.startTransaction();

    const { userId } = req.params;
    const companyId = req.user.company;

    // Cannot remove yourself
    if (userId === req.user.id) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot remove yourself from the company'
      });
    }

    const company = await Company.findById(companyId).session(session);
    company.teamMembers = company.teamMembers.filter(member => 
      member.user.toString() !== userId
    );
    await company.save({ session });

    // Remove company reference from user
    await User.findByIdAndUpdate(
      userId,
      { 
        company: null,
        companyRole: null
      },
      { session }
    );

    await session.commitTransaction();
    transactionCommitted = true;

    res.status(200).json({
      success: true,
      message: 'Team member removed from company',
      data: {}
    });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
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
    const company = await Company.findById(req.user.company).populate('teamMembers.user');
    const teamUserIds = company.teamMembers.map(member => member.user._id);

    const gigs = await Gig.find({ user: { $in: teamUserIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: gigs
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get default permissions based on role
const getDefaultPermissions = (role) => {
  const permissions = {
    admin: ['all'],
    manager: ['create_gig', 'view_analytics', 'manage_team', 'view_billing'],
    member: ['create_gig', 'view_analytics']
  };
  return permissions[role] || permissions.member;
};