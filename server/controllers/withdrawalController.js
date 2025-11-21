// controllers/withdrawalController.js
const mongoose = require('mongoose');
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../utils/paypalClient');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

exports.createPayout = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, userEmail, userName } = req.body;

    if (!amount || parseFloat(amount) < 5) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is $5.' });
    }

    const user = await User.findById(req.user.id).session(session);
    if (!user || user.walletBalance < parseFloat(amount)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Insufficient balance.' });
    }

    const withdrawAmount = parseFloat(amount);

    // Deduct wallet first (prevents overspending in concurrent requests)
    user.walletBalance = parseFloat((user.walletBalance - withdrawAmount).toFixed(2));
    await user.save({ session });

    // Create PayPal Payout request
    const senderBatchId = `batch-${Date.now()}`;
    const requestBody = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: 'You have received a payment from GigShare Platform',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: { value: withdrawAmount.toFixed(2), currency: 'USD' },
          receiver: userEmail,
          note: `Payout to ${userName}`,
        },
      ],
    };

    const request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody(requestBody);

    const payoutResponse = await client().execute(request);
    const batchHeader = payoutResponse.result.batch_header;

    if (!batchHeader.payout_batch_id) {
      await session.abortTransaction();
      return res.status(500).json({ success: false, message: 'Failed to create payout batch.' });
    }

    // Create withdrawal record
    const withdrawal = await Withdrawal.create(
      [
        {
          user: req.user.id,
          amount: withdrawAmount,
          userEmail,
          userName,
          paymentMethod: 'paypal',
          status: 'processing',
          payoutBatchId: batchHeader.payout_batch_id,
          payoutBatchStatus: batchHeader.batch_status,
          initiatedAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Payout initiated successfully.',
      data: withdrawal[0],
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('💥 PayPal payout error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

