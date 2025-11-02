// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  gig: {
    type: mongoose.Schema.ObjectId,
    ref: 'Gig',
    required: true
  },
  share: {
    type: mongoose.Schema.ObjectId,
    ref: 'Share'
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  metadata: {
    platformFee: Number,
    userEarning: Number,
    totalAmount: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);