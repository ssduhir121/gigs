// models/Withdrawal.js
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 5,
    },
    paymentMethod: {
      type: String,
      enum: ['paypal', 'wallet', 'bank_transfer'],
      default: 'paypal',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    payoutBatchId: String, // PayPal payout batch ID
    userEmail: String,
    userName: String,
    adminNotes: String,
    failureReason: String,
    processedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
