// models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  share: {
    type: mongoose.Schema.ObjectId,
    ref: 'Share',
    required: true
  },
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
  proofImages: [{
    url: String,
    filename: String,
    description: String
  }],
  description: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  amount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);