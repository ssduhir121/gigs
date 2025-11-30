

// const mongoose = require('mongoose');

// const invitationSchema = new mongoose.Schema({
//   // Who sent the invitation (company user or admin)
//   sender: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   senderType: {
//     type: String,
//     enum: ['company', 'admin'],
//     required: true
//   },
//   company: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Company'
//   },

//   // Who receives the invitation (service gig owner)
//   recipient: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   serviceGig: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'ServiceGig',
//     required: true
//   },

//   // Which gig to share (the specific gig they're invited to share)
//   targetGig: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Gig',
//     required: true
//   },

//   // Invitation details
//   message: {
//     type: String,
//     maxlength: 500,
//     required: true
//   },
//   compensation: {
//     type: Number,
//     min: 0
//   },
//   customOffer: {
//     type: String,
//     maxlength: 300
//   },

//   // Status tracking
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'rejected', 'expired'],
//     default: 'pending'
//   },
//   responseMessage: {
//     type: String,
//     maxlength: 500
//   },
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
//   },

//   // Auto-application creation when accepted
//   autoCreatedApplication: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Application'
//   },

//   // Share creation tracking
//   shareCreated: {
//     type: Boolean,
//     default: false
//   },
//   shareId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Share'
//   },

//   // Timestamps
//   sentAt: {
//     type: Date,
//     default: Date.now
//   },
//   respondedAt: Date
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for performance
// invitationSchema.index({ sender: 1, status: 1 });
// invitationSchema.index({ recipient: 1, status: 1 });
// invitationSchema.index({ serviceGig: 1, targetGig: 1 });
// invitationSchema.index({ status: 1, expiresAt: 1 });
// invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

// // Virtual for checking if expired
// invitationSchema.virtual('isExpired').get(function() {
//   return this.expiresAt < new Date() && this.status === 'pending';
// });

// // Pre-save middleware to update status if expired
// invitationSchema.pre('save', function(next) {
//   if (this.expiresAt < new Date() && this.status === 'pending') {
//     this.status = 'expired';
//   }
//   next();
// });

// // ✅ FIXED: Pre-save middleware - only validate compensation for NEW invitations
// invitationSchema.pre('save', function(next) {
//   // Only validate compensation when creating NEW company invitations
//   if (this.isNew && this.senderType === 'company' && (!this.compensation || this.compensation <= 0)) {
//     return next(new Error('Compensation is required for company invitations'));
//   }

//   // Always validate that sender and recipient are different users
//   if (this.sender && this.recipient && this.sender.toString() === this.recipient.toString()) {
//     return next(new Error('Cannot send invitation to yourself'));
//   }

//   next();
// });

// // Method to accept invitation
// invitationSchema.methods.accept = async function(responseMessage = '') {
//   const session = await mongoose.startSession();
  
//   try {
//     await session.startTransaction();

//     const Gig = mongoose.model('Gig');
//     const Application = mongoose.model('Application');
//     const Share = mongoose.model('Share');
//     const crypto = require('crypto');

//     this.status = 'accepted';
//     this.responseMessage = responseMessage;
//     this.respondedAt = new Date();

//     // Check if target gig exists and is active
//     const targetGig = await Gig.findById(this.targetGig).session(session);
//     if (!targetGig || !targetGig.isActive) {
//       throw new Error('Target gig not found or inactive');
//     }

//     // ✅ IMPROVED: Check for existing application but don't block if it exists
//     const existingApplication = await Application.findOne({
//       gig: this.targetGig,
//       user: this.recipient
//     }).session(session);

//     let application;

//     if (existingApplication) {
//       console.log('🔍 Existing application found, updating it:', existingApplication._id);
      
//       // Update existing application instead of creating new one
//       existingApplication.status = 'approved';
//       existingApplication.reviewedAt = new Date();
//       existingApplication.reviewedBy = this.sender;
//       existingApplication.reviewNotes = 'Auto-approved via invitation acceptance';
//       existingApplication.fromInvitation = true;
//       existingApplication.invitationId = this._id;
      
//       await existingApplication.save({ session });
//       application = existingApplication;
//       this.autoCreatedApplication = existingApplication._id;
//     } else {
//       // Create new application
//       const newApplication = await Application.create([{
//         gig: this.targetGig,
//         user: this.recipient,
//         status: 'approved',
//         message: `Accepted invitation to share: ${this.message}`,
//         appliedAt: new Date(),
//         reviewedAt: new Date(),
//         reviewedBy: this.sender,
//         reviewNotes: 'Auto-approved via invitation acceptance',
//         fromInvitation: true,
//         invitationId: this._id
//       }], { session });

//       application = newApplication[0];
//       this.autoCreatedApplication = application._id;
//     }

//     // ✅ IMPROVED: Safely handle gig arrays
//     // Add to gig's approved sharers if not already there
//     if (targetGig.approvedSharers) {
//       const isAlreadyApproved = targetGig.approvedSharers.some(sharer => 
//         sharer.user && sharer.user.toString() === this.recipient.toString()
//       );
      
//       if (!isAlreadyApproved) {
//         targetGig.approvedSharers.push({
//           user: this.recipient,
//           approvedAt: new Date(),
//           approvedBy: this.sender,
//           notes: 'Approved via invitation acceptance'
//         });
//       }
//     }

//     // Add to gig's applications array if not already there
//     if (targetGig.applications) {
//       const hasExistingApplication = targetGig.applications.some(app => 
//         app.user && app.user.toString() === this.recipient.toString()
//       );
      
//       if (!hasExistingApplication) {
//         targetGig.applications.push({
//           user: this.recipient,
//           status: 'approved',
//           message: `Accepted invitation to share: ${this.message}`,
//           appliedAt: new Date(),
//           reviewedAt: new Date(),
//           reviewedBy: this.sender,
//           reviewNotes: 'Auto-approved via invitation acceptance'
//         });
//       }
//     }

//     // Create share for the approved user
//     const trackingToken = crypto.randomBytes(16).toString('hex');
//     const share = await Share.create([{
//       gig: this.targetGig,
//       user: this.recipient,
//       trackingToken,
//       fromApplication: true,
//       applicationId: application._id,
//       invitationId: this._id,
//       status: 'active'
//     }], { session });

//     this.shareCreated = true;
//     this.shareId = share[0]._id;

//     // Update application with share info
//     application.shareCreated = true;
//     application.shareId = share[0]._id;
//     await application.save({ session });

//     await targetGig.save({ session });
//     await this.save({ session });

//     await session.commitTransaction();
    
//     console.log('✅ Invitation accepted successfully');
//     return this;

//   } catch (error) {
//     await session.abortTransaction();
//     console.error('❌ Error accepting invitation:', error);
    
//     // Handle duplicate key error specifically
//     if (error.code === 11000) {
//       throw new Error('You have already applied to this gig');
//     }
    
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// // Method to reject invitation
// invitationSchema.methods.reject = async function(responseMessage = '') {
//   this.status = 'rejected';
//   this.responseMessage = responseMessage;
//   this.respondedAt = new Date();
//   return this.save();
// };

// // Static method to find expired invitations and mark them as expired
// invitationSchema.statics.processExpiredInvitations = async function() {
//   try {
//     const result = await this.updateMany(
//       {
//         status: 'pending',
//         expiresAt: { $lt: new Date() }
//       },
//       {
//         $set: { status: 'expired' }
//       }
//     );
    
//     console.log(`Marked ${result.modifiedCount} invitations as expired`);
//     return result;
//   } catch (error) {
//     console.error('Error processing expired invitations:', error);
//     throw error;
//   }
// };

// // Static method to get invitation statistics for a user
// invitationSchema.statics.getUserStats = async function(userId) {
//   try {
//     const stats = await this.aggregate([
//       {
//         $match: {
//           $or: [
//             { sender: mongoose.Types.ObjectId(userId) },
//             { recipient: mongoose.Types.ObjectId(userId) }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//           sent: {
//             $sum: { $cond: [{ $eq: ['$sender', mongoose.Types.ObjectId(userId)] }, 1, 0] }
//           },
//           received: {
//             $sum: { $cond: [{ $eq: ['$recipient', mongoose.Types.ObjectId(userId)] }, 1, 0] }
//           },
//           pending: {
//             $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
//           },
//           accepted: {
//             $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
//           },
//           rejected: {
//             $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
//           },
//           expired: {
//             $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     return stats[0] || {
//       total: 0,
//       sent: 0,
//       received: 0,
//       pending: 0,
//       accepted: 0,
//       rejected: 0,
//       expired: 0
//     };
//   } catch (error) {
//     console.error('Error getting invitation stats:', error);
//     throw error;
//   }
// };

// // Static method to find invitations by service gig and target gig
// invitationSchema.statics.findByServiceAndTargetGig = async function(serviceGigId, targetGigId, status = 'pending') {
//   try {
//     return await this.findOne({
//       serviceGig: serviceGigId,
//       targetGig: targetGigId,
//       status: status
//     }).populate('sender recipient serviceGig targetGig');
//   } catch (error) {
//     console.error('Error finding invitation by service and target gig:', error);
//     throw error;
//   }
// };

// // Instance method to check if user can respond to invitation
// invitationSchema.methods.canRespond = function(userId) {
//   return (
//     this.recipient.toString() === userId.toString() &&
//     this.status === 'pending' &&
//     !this.isExpired
//   );
// };

// // Instance method to resend invitation (extend expiry)
// invitationSchema.methods.resend = async function() {
//   if (this.status !== 'expired') {
//     throw new Error('Can only resend expired invitations');
//   }

//   this.status = 'pending';
//   this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
//   this.responseMessage = undefined;
//   this.respondedAt = undefined;
//   this.autoCreatedApplication = undefined;
//   this.shareCreated = false;
//   this.shareId = undefined;

//   return this.save();
// };

// // Virtual for invitation URL (for sharing)
// invitationSchema.virtual('invitationUrl').get(function() {
//   return `/invitations/${this._id}`;
// });

// // Virtual for days until expiry
// invitationSchema.virtual('daysUntilExpiry').get(function() {
//   if (this.status !== 'pending') return 0;
  
//   const now = new Date();
//   const expiry = new Date(this.expiresAt);
//   const diffTime = expiry - now;
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   return Math.max(0, diffDays);
// });

// // Virtual for isRead (based on respondedAt)
// invitationSchema.virtual('isRead').get(function() {
//   return !!this.respondedAt;
// });

// module.exports = mongoose.model('Invitation', invitationSchema);




// models/Invitation.js
const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  // Who sent the invitation (company user or admin)
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  senderType: {
    type: String,
    enum: ['company', 'admin'],
    required: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  },

  // Who receives the invitation (service gig owner)
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  serviceGig: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceGig',
    required: true
  },

  // Which gig to share (the specific gig they're invited to share)
  targetGig: {
    type: mongoose.Schema.ObjectId,
    ref: 'Gig',
    required: true
  },

  // Invitation details
  message: {
    type: String,
    maxlength: 500,
    required: true
  },
  compensation: {
    type: Number,
    min: 0
  },
  customOffer: {
    type: String,
    maxlength: 300
  },

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  },
  responseMessage: {
    type: String,
    maxlength: 500
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },

  // Auto-application creation when accepted
  autoCreatedApplication: {
    type: mongoose.Schema.ObjectId,
    ref: 'Application'
  },

  // Share creation tracking
  shareCreated: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Share'
  },

  // Timestamps
  sentAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
invitationSchema.index({ sender: 1, status: 1 });
invitationSchema.index({ recipient: 1, status: 1 });
invitationSchema.index({ serviceGig: 1, targetGig: 1 });
invitationSchema.index({ status: 1, expiresAt: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

// Virtual for checking if expired
invitationSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date() && this.status === 'pending';
});

// Pre-save middleware to update status if expired
invitationSchema.pre('save', function(next) {
  if (this.expiresAt < new Date() && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

// ✅ FIXED: Pre-save middleware - only validate compensation for NEW invitations
invitationSchema.pre('save', function(next) {
  // Only validate compensation when creating NEW company invitations
  if (this.isNew && this.senderType === 'company' && (!this.compensation || this.compensation <= 0)) {
    return next(new Error('Compensation is required for company invitations'));
  }

  // Always validate that sender and recipient are different users
  if (this.sender && this.recipient && this.sender.toString() === this.recipient.toString()) {
    return next(new Error('Cannot send invitation to yourself'));
  }

  next();
});

// Method to accept invitation
invitationSchema.methods.accept = async function(responseMessage = '') {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();

    const Gig = mongoose.model('Gig');
    const Application = mongoose.model('Application');
    const Share = mongoose.model('Share');
    const crypto = require('crypto');

    this.status = 'accepted';
    this.responseMessage = responseMessage;
    this.respondedAt = new Date();

    // Check if target gig exists and is active
    const targetGig = await Gig.findById(this.targetGig).session(session);
    if (!targetGig || !targetGig.isActive) {
      throw new Error('Target gig not found or inactive');
    }

    // ✅ IMPROVED: Check for existing application but don't block if it exists
    const existingApplication = await Application.findOne({
      gig: this.targetGig,
      user: this.recipient
    }).session(session);

    let application;

    if (existingApplication) {
      console.log('🔍 Existing application found, updating it:', existingApplication._id);
      
      // Update existing application instead of creating new one
      existingApplication.status = 'approved';
      existingApplication.reviewedAt = new Date();
      existingApplication.reviewedBy = this.sender;
      existingApplication.reviewNotes = 'Auto-approved via invitation acceptance';
      existingApplication.fromInvitation = true;
      existingApplication.invitationId = this._id;
      
      await existingApplication.save({ session });
      application = existingApplication;
      this.autoCreatedApplication = existingApplication._id;
    } else {
      // Create new application
      const newApplication = await Application.create([{
        gig: this.targetGig,
        user: this.recipient,
        status: 'approved',
        message: `Accepted invitation: ${this.message}`,
        appliedAt: new Date(),
        reviewedAt: new Date(),
        reviewedBy: this.sender,
        reviewNotes: 'Auto-approved via invitation acceptance',
        fromInvitation: true,
        invitationId: this._id
      }], { session });

      application = newApplication[0];
      this.autoCreatedApplication = application._id;
    }

    // ✅ IMPROVED: Safely handle gig arrays
    // Add to gig's approved sharers if not already there
    if (targetGig.approvedSharers) {
      const isAlreadyApproved = targetGig.approvedSharers.some(sharer => 
        sharer.user && sharer.user.toString() === this.recipient.toString()
      );
      
      if (!isAlreadyApproved) {
        targetGig.approvedSharers.push({
          user: this.recipient,
          approvedAt: new Date(),
          approvedBy: this.sender,
          notes: 'Approved via invitation acceptance'
        });
      }
    }

    // Add to gig's applications array if not already there
    if (targetGig.applications) {
      const hasExistingApplication = targetGig.applications.some(app => 
        app.user && app.user.toString() === this.recipient.toString()
      );
      
      if (!hasExistingApplication) {
        targetGig.applications.push({
          user: this.recipient,
          status: 'approved',
          message: `Accepted invitation: ${this.message}`,
          appliedAt: new Date(),
          reviewedAt: new Date(),
          reviewedBy: this.sender,
          reviewNotes: 'Auto-approved via invitation acceptance'
        });
      }
    }

    // ✅ UPDATED: Create share with proper tracking fields
    const trackingToken = crypto.randomBytes(16).toString('hex');
    const share = await Share.create([{
      gig: this.targetGig,
      user: this.recipient,
      trackingToken,
      gigType: 'private', // Always private for invitations
      fromInvitation: true, // Mark as from invitation
      invitationId: this._id,
      fromApplication: false,
      totalClicks: 0,
      uniqueClicks: 0,
      uniqueVisitors: [],
      amountEarned: 0,
      isPaid: false,
      submissionStatus: 'pending',
      status: 'active'
    }], { session });

    this.shareCreated = true;
    this.shareId = share[0]._id;

    // Update application with share info
    application.shareCreated = true;
    application.shareId = share[0]._id;
    await application.save({ session });

    await targetGig.save({ session });
    await this.save({ session });

    await session.commitTransaction();
    
    console.log('✅ Invitation accepted successfully');
    return this;

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error accepting invitation:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      throw new Error('You have already applied to this gig');
    }
    
    throw error;
  } finally {
    session.endSession();
  }
};

// Method to reject invitation
invitationSchema.methods.reject = async function(responseMessage = '') {
  this.status = 'rejected';
  this.responseMessage = responseMessage;
  this.respondedAt = new Date();
  return this.save();
};

// Static method to find expired invitations and mark them as expired
invitationSchema.statics.processExpiredInvitations = async function() {
  try {
    const result = await this.updateMany(
      {
        status: 'pending',
        expiresAt: { $lt: new Date() }
      },
      {
        $set: { status: 'expired' }
      }
    );
    
    console.log(`Marked ${result.modifiedCount} invitations as expired`);
    return result;
  } catch (error) {
    console.error('Error processing expired invitations:', error);
    throw error;
  }
};

// Static method to get invitation statistics for a user
invitationSchema.statics.getUserStats = async function(userId) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { recipient: mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          sent: {
            $sum: { $cond: [{ $eq: ['$sender', mongoose.Types.ObjectId(userId)] }, 1, 0] }
          },
          received: {
            $sum: { $cond: [{ $eq: ['$recipient', mongoose.Types.ObjectId(userId)] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          expired: {
            $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      sent: 0,
      received: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      expired: 0
    };
  } catch (error) {
    console.error('Error getting invitation stats:', error);
    throw error;
  }
};

// Static method to find invitations by service gig and target gig
invitationSchema.statics.findByServiceAndTargetGig = async function(serviceGigId, targetGigId, status = 'pending') {
  try {
    return await this.findOne({
      serviceGig: serviceGigId,
      targetGig: targetGigId,
      status: status
    }).populate('sender recipient serviceGig targetGig');
  } catch (error) {
    console.error('Error finding invitation by service and target gig:', error);
    throw error;
  }
};

// Instance method to check if user can respond to invitation
invitationSchema.methods.canRespond = function(userId) {
  return (
    this.recipient.toString() === userId.toString() &&
    this.status === 'pending' &&
    !this.isExpired
  );
};

// Instance method to resend invitation (extend expiry)
invitationSchema.methods.resend = async function() {
  if (this.status !== 'expired') {
    throw new Error('Can only resend expired invitations');
  }

  this.status = 'pending';
  this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  this.responseMessage = undefined;
  this.respondedAt = undefined;
  this.autoCreatedApplication = undefined;
  this.shareCreated = false;
  this.shareId = undefined;

  return this.save();
};

// Virtual for invitation URL (for sharing)
invitationSchema.virtual('invitationUrl').get(function() {
  return `/invitations/${this._id}`;
});

// Virtual for days until expiry
invitationSchema.virtual('daysUntilExpiry').get(function() {
  if (this.status !== 'pending') return 0;
  
  const now = new Date();
  const expiry = new Date(this.expiresAt);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Virtual for isRead (based on respondedAt)
invitationSchema.virtual('isRead').get(function() {
  return !!this.respondedAt;
});

module.exports = mongoose.model('Invitation', invitationSchema);