// // controllers/privateGigs.js
// const Gig = require('../models/Gig');
// const Application = require('../models/Application');
// const Share = require('../models/Share');
// const User = require('../models/User');
// const NotificationService = require('../utils/notificationService');
// const crypto = require('crypto');
// const mongoose = require('mongoose');

// // @desc    Apply to share a private gig
// // @route   POST /api/gigs/:id/apply
// // @access  Private
// exports.applyForPrivateGig = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id } = req.params;
//     const { message } = req.body;
//     const userId = req.user.id;

//     // Find the gig
//     const gig = await Gig.findById(id).session(session);
//     if (!gig) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Gig not found'
//       });
//     }

//     // Check if gig is private
//     if (gig.shareType !== 'private') {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'This gig is not private'
//       });
//     }

//     // Check if user can apply
//     if (!gig.canUserApply(userId)) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot apply to this gig'
//       });
//     }

//     // Create application
//     const application = await Application.create([{
//       gig: gig._id,
//       user: userId,
//       message: message || '',
//       status: gig.privateSettings.autoApprove ? 'approved' : 'pending'
//     }], { session });

//     // Add to gig's applications array
//     gig.applications.push({
//       user: userId,
//       status: gig.privateSettings.autoApprove ? 'approved' : 'pending',
//       message: message || '',
//       appliedAt: new Date()
//     });

//     // If auto-approve is enabled, automatically approve and create share
//     if (gig.privateSettings.autoApprove) {
//       gig.approvedSharers.push({
//         user: userId,
//         approvedAt: new Date(),
//         approvedBy: gig.user,
//         notes: 'Auto-approved'
//       });

//       // Create share immediately
//       const trackingToken = crypto.randomBytes(16).toString('hex');
//       const share = await Share.create([{
//         gig: gig._id,
//         user: userId,
//         trackingToken,
//         fromApplication: true,
//         applicationId: application[0]._id
//       }], { session });

//       // Update application with share info
//       application[0].shareCreated = true;
//       application[0].shareId = share[0]._id;
//       await application[0].save({ session });
//     }

//     await gig.save({ session });
//     await session.commitTransaction();

//     // Send notification to gig owner
//     try {
//       const applicant = await User.findById(userId);
//       const gigOwner = await User.findById(gig.user);
      
//       await NotificationService.createNotification({
//         userId: gig.user,
//         type: 'application_received',
//         title: 'New Application Received',
//         message: `${applicant.name} applied to share your gig "${gig.title}"`,
//         data: {
//           gigId: gig._id,
//           applicationId: application[0]._id,
//           metadata: {
//             gigTitle: gig.title,
//             applicantName: applicant.name,
//             autoApproved: gig.privateSettings.autoApprove
//           }
//         },
//         priority: 'medium'
//       });
//     } catch (notifyError) {
//       console.error('Failed to send notification:', notifyError);
//     }

//     res.status(201).json({
//       success: true,
//       message: gig.privateSettings.autoApprove 
//         ? 'Application approved automatically! Share link created.' 
//         : 'Application submitted successfully. Waiting for approval.',
//       data: {
//         application: application[0],
//         autoApproved: gig.privateSettings.autoApprove,
//         shareCreated: gig.privateSettings.autoApprove
//       }
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// // @desc    Get applications for a private gig (gig owner only)
// // @route   GET /api/gigs/:id/applications
// // @access  Private
// exports.getGigApplications = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // Find the gig and verify ownership
//     const gig = await Gig.findById(id);
//     if (!gig) {
//       return res.status(404).json({
//         success: false,
//         message: 'Gig not found'
//       });
//     }

//     if (gig.user.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to view applications for this gig'
//       });
//     }

//     // Get applications with user details
//     const applications = await Application.find({ gig: id })
//       .populate('user', 'name email createdAt')
//       .sort({ appliedAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: applications,
//       stats: gig.applicationStats
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Approve application
// // @route   POST /api/applications/:applicationId/approve
// // @access  Private (Gig owner only)
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

//     // Verify gig ownership
//     if (application.gig.user.toString() !== userId) {
//       await session.abortTransaction();
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to approve applications for this gig'
//       });
//     }

//     // Update application status
//     application.status = 'approved';
//     application.reviewedAt = new Date();
//     application.reviewedBy = userId;
//     application.reviewNotes = notes || 'Application approved';
//     await application.save({ session });

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

//     // Send notification to applicant
//     try {
//       const applicant = await User.findById(application.user);
      
//       await NotificationService.createNotification({
//         userId: application.user,
//         type: 'application_approved',
//         title: 'Application Approved!',
//         message: `Your application for "${gig.title}" has been approved. You can now share the gig.`,
//         data: {
//           gigId: gig._id,
//           applicationId: application._id,
//           shareId: share[0]._id,
//           metadata: {
//             gigTitle: gig.title,
//             shareUrl: `${req.protocol}://${req.get('host')}/api/gigs/track-share/${trackingToken}`
//           }
//         },
//         priority: 'high'
//       });
//     } catch (notifyError) {
//       console.error('Failed to send notification:', notifyError);
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Application approved successfully',
//       data: {
//         application,
//         share: share[0],
//         shareUrl: `${req.protocol}://${req.get('host')}/api/gigs/track-share/${trackingToken}`
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
// // @route   POST /api/applications/:applicationId/reject
// // @access  Private (Gig owner only)
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

//     // Verify gig ownership
//     if (application.gig.user.toString() !== userId) {
//       await session.abortTransaction();
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to reject applications for this gig'
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

//     // Send notification to applicant
//     try {
//       const applicant = await User.findById(application.user);
      
//       await NotificationService.createNotification({
//         userId: application.user,
//         type: 'application_rejected',
//         title: 'Application Status Update',
//         message: `Your application for "${gig.title}" has been reviewed.`,
//         data: {
//           gigId: gig._id,
//           applicationId: application._id,
//           metadata: {
//             gigTitle: gig.title,
//             status: 'rejected',
//             reason: reason || 'Application rejected'
//           }
//         },
//         priority: 'medium'
//       });
//     } catch (notifyError) {
//       console.error('Failed to send notification:', notifyError);
//     }

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

// // @desc    Get user's applications
// // @route   GET /api/applications/my-applications
// // @access  Private
// exports.getMyApplications = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { status, page = 1, limit = 20 } = req.query;
//     const skip = (page - 1) * limit;

//     let query = { user: userId };
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     const applications = await Application.find(query)
//       .populate('gig', 'title budget sharesRequired sharesCompleted isActive shareType user')
//       .populate({
//         path: 'gig',
//         populate: {
//           path: 'user',
//           select: 'name email'
//         }
//       })
//       .sort({ appliedAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Application.countDocuments(query);

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

// // @desc    Get available private gigs for application
// // @route   GET /api/gigs/private/available
// // @access  Private
// exports.getAvailablePrivateGigs = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { page = 1, limit = 20 } = req.query;
//     const skip = (page - 1) * limit;

//     // Find private gigs that user hasn't applied to and isn't approved for
//     const gigs = await Gig.find({
//       shareType: 'private',
//       isActive: true,
//       'applications.user': { $ne: userId },
//       'approvedSharers.user': { $ne: userId }
//     })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Gig.countDocuments({
//       shareType: 'private',
//       isActive: true,
//       'applications.user': { $ne: userId },
//       'approvedSharers.user': { $ne: userId }
//     });

//     res.status(200).json({
//       success: true,
//       data: gigs,
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



// controllers/privateGigs.js
const Gig = require('../models/Gig');
const Application = require('../models/Application');
const Share = require('../models/Share');
const User = require('../models/User');
const NotificationService = require('../utils/notificationService');
const crypto = require('crypto');
const mongoose = require('mongoose');

// @desc    Apply to share a private gig
// @route   POST /api/gigs/:id/apply
// @access  Private
exports.applyForPrivateGig = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Find the gig
    const gig = await Gig.findById(id).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check if gig is private
    if (gig.shareType !== 'private') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'This gig is not private'
      });
    }

    // Check if user can apply
    if (!gig.canUserApply(userId)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cannot apply to this gig'
      });
    }

    // ✅ FIX: Check for existing application first
    const existingApplication = await Application.findOne({
      gig: gig._id,
      user: userId
    }).session(session);

    if (existingApplication) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this gig',
        data: {
          existingApplication,
          status: existingApplication.status
        }
      });
    }

    // ✅ FIX: Also check if user is already in gig's applications array
    const hasExistingGigApplication = gig.applications.some(app => 
      app.user.toString() === userId.toString()
    );

    if (hasExistingGigApplication) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this gig'
      });
    }

    // ✅ FIX: Check if user is already an approved sharer
    const isAlreadyApproved = gig.approvedSharers.some(sharer => 
      sharer.user.toString() === userId.toString()
    );

    if (isAlreadyApproved) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You are already an approved sharer for this gig'
      });
    }

    // Create application
    const application = await Application.create([{
      gig: gig._id,
      user: userId,
      message: message || '',
      status: gig.privateSettings.autoApprove ? 'approved' : 'pending',
      appliedAt: new Date()
    }], { session });

    // Add to gig's applications array
    gig.applications.push({
      user: userId,
      status: gig.privateSettings.autoApprove ? 'approved' : 'pending',
      message: message || '',
      appliedAt: new Date()
    });

    // If auto-approve is enabled, automatically approve and create share
    if (gig.privateSettings.autoApprove) {
      gig.approvedSharers.push({
        user: userId,
        approvedAt: new Date(),
        approvedBy: gig.user,
        notes: 'Auto-approved'
      });

      // Create share immediately
      const trackingToken = crypto.randomBytes(16).toString('hex');
      const share = await Share.create([{
        gig: gig._id,
        user: userId,
        trackingToken,
        fromApplication: true,
        applicationId: application[0]._id
      }], { session });

      // Update application with share info
      application[0].shareCreated = true;
      application[0].shareId = share[0]._id;
      await application[0].save({ session });
    }

    await gig.save({ session });
    await session.commitTransaction();

    // Send notification to gig owner
    try {
      const applicant = await User.findById(userId);
      const gigOwner = await User.findById(gig.user);
      
      await NotificationService.createNotification({
        userId: gig.user,
        type: 'application_received',
        title: 'New Application Received',
        message: `${applicant.name} applied to share your gig "${gig.title}"`,
        data: {
          gigId: gig._id,
          applicationId: application[0]._id,
          metadata: {
            gigTitle: gig.title,
            applicantName: applicant.name,
            autoApproved: gig.privateSettings.autoApprove
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
    }

    res.status(201).json({
      success: true,
      message: gig.privateSettings.autoApprove 
        ? 'Application approved automatically! Share link created.' 
        : 'Application submitted successfully. Waiting for approval.',
      data: {
        application: application[0],
        autoApproved: gig.privateSettings.autoApprove,
        shareCreated: gig.privateSettings.autoApprove
      }
    });

  } catch (error) {
    await session.abortTransaction();
    
    // ✅ FIX: Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this gig',
        error: 'DUPLICATE_APPLICATION'
      });
    }
    
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get applications for a private gig (gig owner only)
// @route   GET /api/gigs/:id/applications
// @access  Private
exports.getGigApplications = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the gig and verify ownership
    const gig = await Gig.findById(id);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this gig'
      });
    }

    // Get applications with user details
    const applications = await Application.find({ gig: id })
      .populate('user', 'name email avatar createdAt')
      .sort({ appliedAt: -1 });

    // Calculate application stats
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    };

    res.status(200).json({
      success: true,
      data: applications,
      stats: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve application
// @route   POST /api/applications/:applicationId/approve
// @access  Private (Gig owner only)
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

    // Verify gig ownership
    if (application.gig.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve applications for this gig'
      });
    }

    // Check if application is already processed
    if (application.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
      });
    }

    // Update application status
    application.status = 'approved';
    application.reviewedAt = new Date();
    application.reviewedBy = userId;
    application.reviewNotes = notes || 'Application approved';
    await application.save({ session });

    // Add to gig's approved sharers
    const gig = await Gig.findById(application.gig._id).session(session);
    
    // ✅ FIX: Check if user is already approved
    const isAlreadyApproved = gig.approvedSharers.some(sharer => 
      sharer.user.toString() === application.user.toString()
    );

    if (!isAlreadyApproved) {
      gig.approvedSharers.push({
        user: application.user,
        approvedAt: new Date(),
        approvedBy: userId,
        notes: notes || ''
      });
    }

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
    await session.commitTransaction();

    // Send notification to applicant
    try {
      const applicant = await User.findById(application.user);
      
      await NotificationService.createNotification({
        userId: application.user,
        type: 'application_approved',
        title: 'Application Approved!',
        message: `Your application for "${gig.title}" has been approved. You can now share the gig.`,
        data: {
          gigId: gig._id,
          applicationId: application._id,
          shareId: share[0]._id,
          metadata: {
            gigTitle: gig.title,
            shareUrl: `${req.protocol}://${req.get('host')}/share/${trackingToken}`
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
    }

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
// @route   POST /api/applications/:applicationId/reject
// @access  Private (Gig owner only)
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

    // Verify gig ownership
    if (application.gig.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject applications for this gig'
      });
    }

    // Check if application is already processed
    if (application.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`
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
    await session.commitTransaction();

    // Send notification to applicant
    try {
      const applicant = await User.findById(application.user);
      
      await NotificationService.createNotification({
        userId: application.user,
        type: 'application_rejected',
        title: 'Application Status Update',
        message: `Your application for "${gig.title}" has been reviewed.`,
        data: {
          gigId: gig._id,
          applicationId: application._id,
          metadata: {
            gigTitle: gig.title,
            status: 'rejected',
            reason: reason || 'Application rejected'
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
    }

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

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private
exports.getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { user: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'gig',
        select: 'title budget sharesRequired sharesCompleted isActive shareType user createdAt',
        populate: {
          path: 'user',
          select: 'name email company'
        }
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Calculate stats
    const stats = {
      total: await Application.countDocuments({ user: userId }),
      pending: await Application.countDocuments({ user: userId, status: 'pending' }),
      approved: await Application.countDocuments({ user: userId, status: 'approved' }),
      rejected: await Application.countDocuments({ user: userId, status: 'rejected' })
    };

    res.status(200).json({
      success: true,
      data: applications,
      stats: stats,
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

// @desc    Get available private gigs for application
// @route   GET /api/gigs/private/available
// @access  Private
exports.getAvailablePrivateGigs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // ✅ FIX: More comprehensive check for available gigs
    const existingApplications = await Application.find({ user: userId }).select('gig');
    const appliedGigIds = existingApplications.map(app => app.gig.toString());

    const gigs = await Gig.find({
      shareType: 'private',
      isActive: true,
      _id: { $nin: appliedGigIds }, // Not in applied gigs
      'approvedSharers.user': { $ne: userId }, // Not already approved
      user: { $ne: userId } // Not the gig owner
    })
      .populate('user', 'name email company avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gig.countDocuments({
      shareType: 'private',
      isActive: true,
      _id: { $nin: appliedGigIds },
      'approvedSharers.user': { $ne: userId },
      user: { $ne: userId }
    });

    res.status(200).json({
      success: true,
      data: gigs,
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

// @desc    Check if user has applied to a gig
// @route   GET /api/gigs/:id/application-status
// @access  Private
exports.getApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await Application.findOne({
      gig: id,
      user: userId
    });

    const gig = await Gig.findById(id);
    const isApproved = gig?.approvedSharers?.some(sharer => 
      sharer.user.toString() === userId.toString()
    );

    const canApply = !application && !isApproved && 
                    gig?.shareType === 'private' && 
                    gig?.isActive && 
                    gig?.user.toString() !== userId;

    res.status(200).json({
      success: true,
      data: {
        hasApplied: !!application,
        application,
        isApproved,
        canApply,
        gigActive: gig?.isActive,
        isGigOwner: gig?.user.toString() === userId.toString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:applicationId/withdraw
// @access  Private
exports.withdrawApplication = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Find application
    const application = await Application.findById(applicationId).session(session);
    if (!application) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify ownership
    if (application.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (application.status !== 'pending') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application that is already ${application.status}`
      });
    }

    // Remove from gig's applications array
    const gig = await Gig.findById(application.gig).session(session);
    if (gig) {
      gig.applications = gig.applications.filter(app => 
        app.user.toString() !== userId.toString()
      );
      await gig.save({ session });
    }

    // Delete application
    await Application.findByIdAndDelete(applicationId).session(session);

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      data: {
        withdrawnApplicationId: applicationId
      }
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:applicationId
// @access  Private
exports.getApplicationById = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(applicationId)
      .populate({
        path: 'gig',
        select: 'title budget sharesRequired sharesCompleted isActive shareType user privateSettings',
        populate: {
          path: 'user',
          select: 'name email company avatar'
        }
      })
      .populate('user', 'name email avatar');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to view this application
    const isGigOwner = application.gig.user._id.toString() === userId.toString();
    const isApplicant = application.user._id.toString() === userId.toString();

    if (!isGigOwner && !isApplicant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application statistics for gig owner
// @route   GET /api/gigs/:id/application-stats
// @access  Private
exports.getApplicationStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the gig and verify ownership
    const gig = await Gig.findById(id);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view stats for this gig'
      });
    }

    const applications = await Application.find({ gig: id });
    
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      autoApproved: applications.filter(app => 
        app.status === 'approved' && gig.privateSettings.autoApprove
      ).length,
      conversionRate: applications.length > 0 ? 
        (applications.filter(app => app.status === 'approved').length / applications.length * 100).toFixed(1) : 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};