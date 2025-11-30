// // models/Application.js
// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema({
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
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   message: {
//     type: String,
//     maxlength: 500
//   },
//   appliedAt: {
//     type: Date,
//     default: Date.now
//   },
//   reviewedAt: Date,
//   reviewedBy: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User'
//   },
//   reviewNotes: String,
//   // Track if share was created after approval
//   shareCreated: {
//     type: Boolean,
//     default: false
//   },
//   shareId: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Share'
//   }
// }, {
//   timestamps: true
// });

// // Ensure one application per user per gig
// applicationSchema.index({ gig: 1, user: 1 }, { unique: true });

// // Index for faster queries
// applicationSchema.index({ user: 1, status: 1 });
// applicationSchema.index({ gig: 1, status: 1 });
// applicationSchema.index({ status: 1, appliedAt: -1 });

// module.exports = mongoose.model('Application', applicationSchema);


// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  
  // NEW: Track if this application is from an invitation
  fromInvitation: {
    type: Boolean,
    default: false
  },
  invitationId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Invitation'
  },
  
  // Track if share was created after approval
  shareCreated: {
    type: Boolean,
    default: false
  },
  shareId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Share'
  }
}, {
  timestamps: true
});

// Ensure one application per user per gig
applicationSchema.index({ gig: 1, user: 1 }, { unique: true });

// Index for faster queries
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ gig: 1, status: 1 });
applicationSchema.index({ status: 1, appliedAt: -1 });
applicationSchema.index({ fromInvitation: 1 }); // NEW: Index for invitation tracking

module.exports = mongoose.model('Application', applicationSchema);