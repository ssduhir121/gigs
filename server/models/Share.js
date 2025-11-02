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
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for faster queries
ShareSchema.index({ trackingToken: 1 });
ShareSchema.index({ gig: 1, user: 1 });

module.exports = mongoose.model('Share', ShareSchema);