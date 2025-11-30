// const express = require('express');
// const { protect } = require('../middleware/auth');
// const Invitation = require('../models/Invitation');
// const ServiceGig = require('../models/ServiceGig');
// const Gig = require('../models/Gig');
// const User = require('../models/User');

// const router = express.Router();

// // @desc    Send invitation to service gig owner
// // @route   POST /api/invitations
// // @access  Private (Company/Admin)
// router.post('/', protect, async (req, res) => {
//   try {
//     const { serviceGigId, targetGigId, message, compensation, customOffer } = req.body;

//     // Validate required fields
//     if (!serviceGigId || !targetGigId || !message) {
//       return res.status(400).json({
//         success: false,
//         message: 'Service gig, target gig, and message are required'
//       });
//     }

//     // Check if user is company user or admin
//     const isCompanyUser = req.user.company && ['owner', 'admin', 'manager'].includes(req.user.companyRole);
//     const isAdmin = req.user.role === 'admin';
    
//     if (!isCompanyUser && !isAdmin) {
//       return res.status(403).json({
//         success: false,
//         message: 'Only company members and admins can send invitations'
//       });
//     }

//     // Verify service gig exists and is active
//     const serviceGig = await ServiceGig.findOne({
//       _id: serviceGigId,
//       status: 'active'
//     }).populate('user');

//     if (!serviceGig) {
//       return res.status(404).json({
//         success: false,
//         message: 'Service gig not found or not active'
//       });
//     }

//     // Verify target gig exists and belongs to company/admin
//     const targetGig = await Gig.findById(targetGigId);
//     if (!targetGig) {
//       return res.status(404).json({
//         success: false,
//         message: 'Target gig not found'
//       });
//     }

//     // Check permissions for target gig
//     if (isCompanyUser) {
//       const companyGigs = await Gig.find({ user: req.user.id });
//       const canAccessGig = companyGigs.some(gig => gig._id.toString() === targetGigId);
      
//       if (!canAccessGig) {
//         return res.status(403).json({
//           success: false,
//           message: 'You can only invite to your company gigs'
//         });
//       }
//     }

//     // Check for existing invitation
//     const existingInvitation = await Invitation.findOne({
//       serviceGig: serviceGigId,
//       targetGig: targetGigId,
//       status: 'pending'
//     });

//     if (existingInvitation) {
//       return res.status(400).json({
//         success: false,
//         message: 'An active invitation already exists for this service gig'
//       });
//     }

//     // Create invitation
//     const invitation = await Invitation.create({
//       sender: req.user.id,
//       senderType: isCompanyUser ? 'company' : 'admin',
//       company: isCompanyUser ? req.user.company : null,
//       recipient: serviceGig.user._id,
//       serviceGig: serviceGigId,
//       targetGig: targetGigId,
//       message: message.trim(),
//       compensation: compensation || null,
//       customOffer: customOffer || null
//     });

//     // Populate the invitation
//     await invitation.populate([
//       { path: 'recipient', select: 'name email' },
//       { path: 'serviceGig', select: 'title price' },
//       { path: 'targetGig', select: 'title budget' },
//       { path: 'company', select: 'companyName' }
//     ]);

//     // TODO: Send email notification to service gig owner

//     res.status(201).json({
//       success: true,
//       message: 'Invitation sent successfully',
//       data: invitation
//     });

//   } catch (error) {
//     console.error('Send invitation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error sending invitation',
//       error: error.message
//     });
//   }
// });

// // @desc    Get invitations sent by user/company
// // @route   GET /api/invitations/sent
// // @access  Private (Company/Admin)
// router.get('/sent', protect, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status } = req.query;
//     const skip = (page - 1) * limit;

//     let query = { sender: req.user.id };
    
//     // Add status filter if provided
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     const invitations = await Invitation.find(query)
//       .populate('recipient', 'name email')
//       .populate('serviceGig', 'title price image')
//       .populate('targetGig', 'title budget shareType')
//       .populate('company', 'companyName')
//       .sort({ sentAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Invitation.countDocuments(query);

//     res.json({
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
//     console.error('Get sent invitations error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching sent invitations'
//     });
//   }
// });

// // @desc    Get invitations received by user
// // @route   GET /api/invitations/received
// // @access  Private
// router.get('/received', protect, async (req, res) => {
//   try {
//     const { page = 1, limit = 10, status } = req.query;
//     const skip = (page - 1) * limit;

//     let query = { recipient: req.user.id };
    
//     // Add status filter if provided
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     const invitations = await Invitation.find(query)
//       .populate('sender', 'name email')
//       .populate('serviceGig', 'title price image')
//       .populate('targetGig', 'title budget shareType user')
//       .populate('company', 'companyName')
//       .populate({
//         path: 'targetGig',
//         populate: {
//           path: 'user',
//           select: 'name email'
//         }
//       })
//       .sort({ sentAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Invitation.countDocuments(query);

//     res.json({
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
//     console.error('Get received invitations error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching received invitations'
//     });
//   }
// });

// // @desc    Accept invitation
// // @route   POST /api/invitations/:id/accept
// // @access  Private
// router.post('/:id/accept', protect, async (req, res) => {
//   try {
//     const { responseMessage } = req.body;

//     const invitation = await Invitation.findById(req.params.id)
//       .populate('recipient')
//       .populate('targetGig');

//     if (!invitation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invitation not found'
//       });
//     }

//     // Check ownership
//     if (invitation.recipient._id.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to accept this invitation'
//       });
//     }

//     // Check if already responded
//     if (invitation.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Invitation is already ${invitation.status}`
//       });
//     }

//     // Check if expired
//     if (invitation.isExpired) {
//       invitation.status = 'expired';
//       await invitation.save();
//       return res.status(400).json({
//         success: false,
//         message: 'Invitation has expired'
//       });
//     }

//     // Accept invitation (this creates application automatically)
//     await invitation.accept(responseMessage);

//     // Populate the updated invitation
//     await invitation.populate([
//       { path: 'sender', select: 'name email' },
//       { path: 'serviceGig', select: 'title price' },
//       { path: 'targetGig', select: 'title budget' },
//       { path: 'autoCreatedApplication' }
//     ]);

//     // TODO: Send notification to sender

//     res.json({
//       success: true,
//       message: 'Invitation accepted successfully',
//       data: invitation
//     });

//   } catch (error) {
//     console.error('Accept invitation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error accepting invitation',
//       error: error.message
//     });
//   }
// });

// // @desc    Reject invitation
// // @route   POST /api/invitations/:id/reject
// // @access  Private
// router.post('/:id/reject', protect, async (req, res) => {
//   try {
//     const { responseMessage } = req.body;

//     const invitation = await Invitation.findById(req.params.id)
//       .populate('recipient');

//     if (!invitation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Invitation not found'
//       });
//     }

//     // Check ownership
//     if (invitation.recipient._id.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to reject this invitation'
//       });
//     }

//     // Check if already responded
//     if (invitation.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         message: `Invitation is already ${invitation.status}`
//       });
//     }

//     // Reject invitation
//     await invitation.reject(responseMessage);

//     // Populate the updated invitation
//     await invitation.populate([
//       { path: 'sender', select: 'name email' },
//       { path: 'serviceGig', select: 'title price' },
//       { path: 'targetGig', select: 'title budget' }
//     ]);

//     // TODO: Send notification to sender

//     res.json({
//       success: true,
//       message: 'Invitation rejected',
//       data: invitation
//     });

//   } catch (error) {
//     console.error('Reject invitation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error rejecting invitation'
//     });
//   }
// });

// // @desc    Get invitation statistics
// // @route   GET /api/invitations/stats
// // @access  Private (Company/Admin)
// router.get('/stats', protect, async (req, res) => {
//   try {
//     const stats = await Invitation.aggregate([
//       {
//         $match: {
//           $or: [
//             { sender: req.user._id },
//             { company: req.user.company }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
//           accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
//           rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
//           expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
//         }
//       }
//     ]);

//     const result = stats[0] || {
//       total: 0,
//       pending: 0,
//       accepted: 0,
//       rejected: 0,
//       expired: 0
//     };

//     res.json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     console.error('Get invitation stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching invitation statistics'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const { protect } = require('../middleware/auth');
const Invitation = require('../models/Invitation');
const ServiceGig = require('../models/ServiceGig');
const Gig = require('../models/Gig');
const User = require('../models/User');
const NotificationService = require('../utils/notificationService');

const router = express.Router();

// @desc    Send invitation to service gig owner
// @route   POST /api/invitations
// @access  Private (Company/Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { serviceGigId, targetGigId, message, compensation, customOffer } = req.body;

    // Validate required fields
    if (!serviceGigId || !targetGigId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Service gig, target gig, and message are required'
      });
    }

    // Check if user is company user or admin
    const isCompanyUser = req.user.company && ['owner', 'admin', 'manager'].includes(req.user.companyRole);
    const isAdmin = req.user.role === 'admin';
    
    if (!isCompanyUser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only company members and admins can send invitations'
      });
    }

    // Verify service gig exists and is active
    const serviceGig = await ServiceGig.findOne({
      _id: serviceGigId,
      status: 'active'
    }).populate('user');

    if (!serviceGig) {
      return res.status(404).json({
        success: false,
        message: 'Service gig not found or not active'
      });
    }

    // Verify target gig exists and belongs to company/admin
    const targetGig = await Gig.findById(targetGigId);
    if (!targetGig) {
      return res.status(404).json({
        success: false,
        message: 'Target gig not found'
      });
    }

    // Check permissions for target gig
    if (isCompanyUser) {
      const companyGigs = await Gig.find({ user: req.user.id });
      const canAccessGig = companyGigs.some(gig => gig._id.toString() === targetGigId);
      
      if (!canAccessGig) {
        return res.status(403).json({
          success: false,
          message: 'You can only invite to your company gigs'
        });
      }
    }

    // Check for existing invitation
    const existingInvitation = await Invitation.findOne({
      serviceGig: serviceGigId,
      targetGig: targetGigId,
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: 'An active invitation already exists for this service gig'
      });
    }

    // Create invitation
    const invitation = await Invitation.create({
      sender: req.user.id,
      senderType: isCompanyUser ? 'company' : 'admin',
      company: isCompanyUser ? req.user.company : null,
      recipient: serviceGig.user._id,
      serviceGig: serviceGigId,
      targetGig: targetGigId,
      message: message.trim(),
      compensation: compensation || null,
      customOffer: customOffer || null
    });

    // Populate the invitation
    await invitation.populate([
      { path: 'recipient', select: 'name email' },
      { path: 'serviceGig', select: 'title price' },
      { path: 'targetGig', select: 'title budget' },
      { path: 'company', select: 'companyName' }
    ]);

    // 🔔 NOTIFICATION: Invitation Sent to Recipient
    try {
      await NotificationService.createNotification({
        userId: serviceGig.user._id,
        type: 'system_announcement',
        title: 'New Invitation Received',
        message: `You have received an invitation from ${req.user.name} for your service gig "${serviceGig.title}".`,
        data: {
          invitationId: invitation._id,
          serviceGigId: serviceGigId,
          targetGigId: targetGigId,
          senderId: req.user.id,
          senderType: isCompanyUser ? 'company' : 'admin',
          metadata: {
            serviceGigTitle: serviceGig.title,
            targetGigTitle: targetGig.title,
            senderName: req.user.name,
            companyName: isCompanyUser ? req.user.companyName : null,
            compensation: compensation,
            sentAt: new Date()
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation sent notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Invitation Sent Confirmation to Sender
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Invitation Sent',
        message: `Your invitation for "${serviceGig.title}" has been sent to ${serviceGig.user.name}.`,
        data: {
          invitationId: invitation._id,
          serviceGigId: serviceGigId,
          targetGigId: targetGigId,
          recipientId: serviceGig.user._id,
          metadata: {
            serviceGigTitle: serviceGig.title,
            targetGigTitle: targetGig.title,
            recipientName: serviceGig.user.name,
            sentAt: new Date()
          }
        },
        priority: 'low'
      });
    } catch (notifyError) {
      console.error('Invitation confirmation notification failed:', notifyError);
    }

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: invitation
    });

  } catch (error) {
    console.error('Send invitation error:', error);
    
    // 🔔 NOTIFICATION: Invitation Sending Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Invitation Failed',
        message: `Failed to send invitation. Please try again. Error: ${error.message}`,
        data: {
          serviceGigId: req.body.serviceGigId,
          targetGigId: req.body.targetGigId,
          error: error.message,
          metadata: {
            failedAt: new Date(),
            errorType: 'invitation_creation_failed'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Invitation failure notification failed:', notifyError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error sending invitation',
      error: error.message
    });
  }
});

// @desc    Get invitations sent by user/company
// @route   GET /api/invitations/sent
// @access  Private (Company/Admin)
router.get('/sent', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { sender: req.user.id };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const invitations = await Invitation.find(query)
      .populate('recipient', 'name email')
      .populate('serviceGig', 'title price image')
      .populate('targetGig', 'title budget shareType')
      .populate('company', 'companyName')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invitation.countDocuments(query);

    res.json({
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
    console.error('Get sent invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sent invitations'
    });
  }
});

// @desc    Get invitations received by user
// @route   GET /api/invitations/received
// @access  Private
router.get('/received', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = { recipient: req.user.id };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    const invitations = await Invitation.find(query)
      .populate('sender', 'name email')
      .populate('serviceGig', 'title price image')
      .populate('targetGig', 'title budget shareType user')
      .populate('company', 'companyName')
      .populate({
        path: 'targetGig',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invitation.countDocuments(query);

    res.json({
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
    console.error('Get received invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching received invitations'
    });
  }
});

// @desc    Accept invitation
// @route   POST /api/invitations/:id/accept
// @access  Private
router.post('/:id/accept', protect, async (req, res) => {
  try {
    const { responseMessage } = req.body;

    const invitation = await Invitation.findById(req.params.id)
      .populate('recipient')
      .populate('targetGig')
      .populate('sender')
      .populate('serviceGig');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    // Check ownership
    if (invitation.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this invitation'
      });
    }

    // Check if already responded
    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Invitation is already ${invitation.status}`
      });
    }

    // Check if expired
    if (invitation.isExpired) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({
        success: false,
        message: 'Invitation has expired'
      });
    }

    // Accept invitation (this creates application automatically)
    await invitation.accept(responseMessage);

    // Populate the updated invitation
    await invitation.populate([
      { path: 'sender', select: 'name email' },
      { path: 'serviceGig', select: 'title price' },
      { path: 'targetGig', select: 'title budget' },
      { path: 'autoCreatedApplication' }
    ]);

    // 🔔 NOTIFICATION: Invitation Accepted to Sender
    try {
      await NotificationService.createNotification({
        userId: invitation.sender._id,
        type: 'system_announcement',
        title: 'Invitation Accepted!',
        message: `${req.user.name} accepted your invitation for "${invitation.serviceGig.title}" service gig.`,
        data: {
          invitationId: invitation._id,
          serviceGigId: invitation.serviceGig._id,
          targetGigId: invitation.targetGig._id,
          recipientId: req.user.id,
          applicationId: invitation.autoCreatedApplication?._id,
          metadata: {
            serviceGigTitle: invitation.serviceGig.title,
            targetGigTitle: invitation.targetGig.title,
            recipientName: req.user.name,
            acceptedAt: new Date(),
            responseMessage: responseMessage
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation accepted notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Invitation Accepted Confirmation to Recipient
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Invitation Accepted',
        message: `You accepted the invitation for "${invitation.serviceGig.title}". Your application has been submitted.`,
        data: {
          invitationId: invitation._id,
          serviceGigId: invitation.serviceGig._id,
          targetGigId: invitation.targetGig._id,
          applicationId: invitation.autoCreatedApplication?._id,
          metadata: {
            serviceGigTitle: invitation.serviceGig.title,
            targetGigTitle: invitation.targetGig.title,
            acceptedAt: new Date()
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation acceptance confirmation failed:', notifyError);
    }

    res.json({
      success: true,
      message: 'Invitation accepted successfully',
      data: invitation
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    
    // 🔔 NOTIFICATION: Invitation Acceptance Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Invitation Acceptance Failed',
        message: `Failed to accept invitation. Please try again. Error: ${error.message}`,
        data: {
          invitationId: req.params.id,
          error: error.message,
          metadata: {
            failedAt: new Date(),
            errorType: 'invitation_acceptance_failed'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Invitation acceptance failure notification failed:', notifyError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error accepting invitation',
      error: error.message
    });
  }
});

// @desc    Reject invitation
// @route   POST /api/invitations/:id/reject
// @access  Private
router.post('/:id/reject', protect, async (req, res) => {
  try {
    const { responseMessage } = req.body;

    const invitation = await Invitation.findById(req.params.id)
      .populate('recipient')
      .populate('sender')
      .populate('serviceGig')
      .populate('targetGig');

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    // Check ownership
    if (invitation.recipient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this invitation'
      });
    }

    // Check if already responded
    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Invitation is already ${invitation.status}`
      });
    }

    // Reject invitation
    await invitation.reject(responseMessage);

    // Populate the updated invitation
    await invitation.populate([
      { path: 'sender', select: 'name email' },
      { path: 'serviceGig', select: 'title price' },
      { path: 'targetGig', select: 'title budget' }
    ]);

    // 🔔 NOTIFICATION: Invitation Rejected to Sender
    try {
      await NotificationService.createNotification({
        userId: invitation.sender._id,
        type: 'system_announcement',
        title: 'Invitation Rejected',
        message: `${req.user.name} declined your invitation for "${invitation.serviceGig.title}" service gig.`,
        data: {
          invitationId: invitation._id,
          serviceGigId: invitation.serviceGig._id,
          targetGigId: invitation.targetGig._id,
          recipientId: req.user.id,
          rejectionReason: responseMessage,
          metadata: {
            serviceGigTitle: invitation.serviceGig.title,
            targetGigTitle: invitation.targetGig.title,
            recipientName: req.user.name,
            rejectedAt: new Date(),
            responseMessage: responseMessage
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Invitation rejected notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Invitation Rejected Confirmation to Recipient
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Invitation Declined',
        message: `You declined the invitation for "${invitation.serviceGig.title}".`,
        data: {
          invitationId: invitation._id,
          serviceGigId: invitation.serviceGig._id,
          targetGigId: invitation.targetGig._id,
          metadata: {
            serviceGigTitle: invitation.serviceGig.title,
            targetGigTitle: invitation.targetGig.title,
            rejectedAt: new Date(),
            responseMessage: responseMessage
          }
        },
        priority: 'low'
      });
    } catch (notifyError) {
      console.error('Invitation rejection confirmation failed:', notifyError);
    }

    res.json({
      success: true,
      message: 'Invitation rejected',
      data: invitation
    });

  } catch (error) {
    console.error('Reject invitation error:', error);
    
    // 🔔 NOTIFICATION: Invitation Rejection Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Invitation Rejection Failed',
        message: `Failed to reject invitation. Please try again. Error: ${error.message}`,
        data: {
          invitationId: req.params.id,
          error: error.message,
          metadata: {
            failedAt: new Date(),
            errorType: 'invitation_rejection_failed'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Invitation rejection failure notification failed:', notifyError);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error rejecting invitation'
    });
  }
});

// @desc    Get invitation statistics
// @route   GET /api/invitations/stats
// @access  Private (Company/Admin)
router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Invitation.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { company: req.user.company }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      expired: 0
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get invitation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invitation statistics'
    });
  }
});

// @desc    Get single invitation by ID
// @route   GET /api/invitations/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .populate('serviceGig', 'title price image description')
      .populate('targetGig', 'title budget shareType user')
      .populate('company', 'companyName')
      .populate({
        path: 'targetGig',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: 'Invitation not found'
      });
    }

    // Check if user is sender or recipient
    const isSender = invitation.sender._id.toString() === req.user.id;
    const isRecipient = invitation.recipient._id.toString() === req.user.id;
    
    if (!isSender && !isRecipient) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this invitation'
      });
    }

    res.json({
      success: true,
      data: invitation
    });

  } catch (error) {
    console.error('Get invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invitation'
    });
  }
});


// Add this debug route to check existing applications
router.get('/debug/check-application/:gigId', protect, async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;

    const Application = require('../models/Application');
    const Gig = require('../models/Gig');

    // Check in Application collection
    const existingApplications = await Application.find({
      gig: gigId,
      user: userId
    });

    // Check in Gig's applications array
    const gig = await Gig.findById(gigId);
    const gigApplications = gig?.applications?.filter(app => 
      app.user.toString() === userId.toString()
    ) || [];

    // Check in Gig's approvedSharers array
    const approvedSharers = gig?.approvedSharers?.filter(sharer => 
      sharer.user.toString() === userId.toString()
    ) || [];

    res.json({
      success: true,
      data: {
        existingApplications,
        gigApplications,
        approvedSharers,
        gigExists: !!gig,
        gigActive: gig?.isActive,
        canApply: existingApplications.length === 0 && 
                  gigApplications.length === 0 && 
                  approvedSharers.length === 0
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug failed',
      error: error.message
    });
  }
});

module.exports = router;