
// // models/Share.js
// const mongoose = require('mongoose');

// const ShareSchema = new mongoose.Schema({
//   gig: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Gig',
//     required: true
//   },
//   user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   trackingToken: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   totalClicks: {
//     type: Number,
//     default: 0
//   },
//   uniqueClicks: {
//     type: Number,
//     default: 0
//   },
//   uniqueVisitors: [{
//     type: String // Hashed visitor identifiers
//   }],
  
//   // NEW: Verification system fields
//   submissionStatus: {
//     type: String,
//     enum: ['pending', 'submitted', 'approved', 'rejected', 'paid'],
//     default: 'pending'
//   },
//   submissionProof: [{
//     imageUrl: {
//       type: String,
//       required: true
//     },
//     description: String,
//     submittedAt: {
//       type: Date,
//       default: Date.now
//     },
//     verifiedAt: Date,
//     verifiedBy: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User'
//     },
//     verificationNotes: String,
//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'rejected'],
//       default: 'pending'
//     }
//   }],
  
//   amountEarned: {
//     type: Number,
//     default: 0
//   },
//   platformFee: {
//     type: Number,
//     default: 0
//   },
//   totalAmount: {
//     type: Number,
//     default: 0
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
  
//   // Track submission and approval dates
//   submittedAt: Date,
//   approvedAt: Date,
//   rejectedAt: Date,
//   paidAt: Date,
  
//   ipAddress: String,
//   userAgent: String
// }, {
//   timestamps: true
// });

// // Index for faster queries
// ShareSchema.index({ trackingToken: 1 });
// ShareSchema.index({ gig: 1, user: 1 }, { unique: true });
// ShareSchema.index({ submissionStatus: 1 });
// ShareSchema.index({ user: 1, submissionStatus: 1 });

// // Virtual for checking if submission is pending review
// ShareSchema.virtual('isPendingReview').get(function() {
//   return this.submissionStatus === 'submitted';
// });

// // Virtual for checking if approved but not paid
// ShareSchema.virtual('isApprovedUnpaid').get(function() {
//   return this.submissionStatus === 'approved' && !this.isPaid;
// });

// module.exports = mongoose.model('Share', ShareSchema);


// models/Share.js
const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
  gig: {
    type: mongoose.Schema.ObjectId,
    ref: 'Gig',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  trackingToken: {
    type: String,
    required: true,
    unique: true
  },
  
  // NEW: Track gig type for authorization and filtering
  gigType: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  
  // NEW: Track if this share was created from an invitation
  fromInvitation: {
    type: Boolean,
    default: false
  },
  invitationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invitation'
  },
  
  // NEW: Track if this share was created from an application
  fromApplication: {
    type: Boolean,
    default: false
  },
  applicationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Application'
  },

  totalClicks: {
    type: Number,
    default: 0
  },
  uniqueClicks: {
    type: Number,
    default: 0
  },
  uniqueVisitors: [{
    type: String // Hashed visitor identifiers
  }],
  
  // Verification system fields
  submissionStatus: {
    type: String,
    enum: ['pending', 'submitted', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  submissionProof: [{
    imageUrl: {
      type: String,
      required: true
    },
    description: String,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    verificationNotes: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  
  amountEarned: {
    type: Number,
    default: 0
  },
  platformFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
   totalSocialShares: {
    type: Number,
    default: 0
  },
  socialSharesByPlatform: {
    type: Map,
    of: Number,
    default: {}
  },
  socialShares: [{
    platform: {
      type: String,
      required: true,
      enum: ['facebook', 'twitter', 'linkedin', 'instagram', 'whatsapp', 'telegram', 'other']
    },
    shareUrl: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userAgent: String,
    ipAddress: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Track submission and approval dates
  submittedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  paidAt: Date,
  
  ipAddress: String,
  userAgent: String,
  
  // Status tracking for better management
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
ShareSchema.index({ 'socialShares.platform': 1 });
ShareSchema.index({ 'socialShares.timestamp': 1 });
ShareSchema.index({ trackingToken: 1 });
ShareSchema.index({ gig: 1, user: 1 }, { unique: true });
ShareSchema.index({ submissionStatus: 1 });
ShareSchema.index({ user: 1, submissionStatus: 1 });
ShareSchema.index({ gigType: 1 }); // NEW: Index for gig type
ShareSchema.index({ fromInvitation: 1 }); // NEW: Index for invitation tracking
ShareSchema.index({ fromApplication: 1 }); // NEW: Index for application tracking

// Virtual for checking if submission is pending review
ShareSchema.virtual('isPendingReview').get(function() {
  return this.submissionStatus === 'submitted';
});

// Virtual for checking if approved but not paid
ShareSchema.virtual('isApprovedUnpaid').get(function() {
  return this.submissionStatus === 'approved' && !this.isPaid;
});

// Virtual for checking if share is active
ShareSchema.virtual('isActive').get(function() {
  return this.status === 'active' && this.submissionStatus !== 'rejected';
});

// Method to check if user can submit proof
ShareSchema.methods.canSubmitProof = function() {
  return this.submissionStatus === 'pending' && this.status === 'active';
};

// Method to check if user can earn from this share
ShareSchema.methods.canEarn = function() {
  return this.submissionStatus === 'approved' && !this.isPaid && this.status === 'active';
};

module.exports = mongoose.model('Share', ShareSchema);