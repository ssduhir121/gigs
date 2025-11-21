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
//   ipAddress: String,
//   userAgent: String
// }, {
//   timestamps: true
// });

// // Index for faster queries
// ShareSchema.index({ trackingToken: 1 });
// ShareSchema.index({ gig: 1, user: 1 }, { unique: true });
// // ShareSchema.index({ gig: 1, user: 1 });

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
  
  // NEW: Verification system fields
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
  
  // Track submission and approval dates
  submittedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  paidAt: Date,
  
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for faster queries
ShareSchema.index({ trackingToken: 1 });
ShareSchema.index({ gig: 1, user: 1 }, { unique: true });
ShareSchema.index({ submissionStatus: 1 });
ShareSchema.index({ user: 1, submissionStatus: 1 });

// Virtual for checking if submission is pending review
ShareSchema.virtual('isPendingReview').get(function() {
  return this.submissionStatus === 'submitted';
});

// Virtual for checking if approved but not paid
ShareSchema.virtual('isApprovedUnpaid').get(function() {
  return this.submissionStatus === 'approved' && !this.isPaid;
});

module.exports = mongoose.model('Share', ShareSchema);