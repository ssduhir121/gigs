// controllers/paypalWebhook.js
const Withdrawal = require('../models/Withdrawal');
const mongoose = require('mongoose');

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    console.log('💡 PayPal Webhook Event:', event.event_type);

    // Ensure event and resource are valid
    if (!event || !event.resource) {
      console.warn('⚠️ Invalid webhook payload');
      return res.status(400).send('Invalid webhook payload');
    }

    const payoutItem = event.resource;
    const batchId = payoutItem.payout_batch_id;

    if (!batchId) {
      console.warn('⚠️ Missing payout_batch_id in webhook payload');
      return res.status(400).send('Missing payout_batch_id');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const withdrawal = await Withdrawal.findOne({ payoutBatchId: batchId }).session(session);

      if (!withdrawal) {
        console.warn('❌ Withdrawal not found for batch:', batchId);
        await session.abortTransaction();
        return res.status(404).send('Withdrawal not found');
      }

      // Update withdrawal based on event type
      switch (event.event_type) {
        case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
          withdrawal.status = 'completed';
          withdrawal.processedAt = new Date();
          break;
        case 'PAYMENT.PAYOUTS-ITEM.FAILED':
          withdrawal.status = 'failed';
          withdrawal.failureReason = payoutItem.errors?.name || 'Unknown';
          withdrawal.processedAt = new Date();
          break;
        case 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED':
          withdrawal.status = 'pending';
          withdrawal.processedAt = null;
          break;
        default:
          console.log('ℹ️ Unhandled PayPal event type:', event.event_type);
          break;
      }

      await withdrawal.save({ session });
      await session.commitTransaction();

      res.status(200).send('Webhook processed successfully');
    } catch (err) {
      await session.abortTransaction();
      console.error('💥 Webhook DB error:', err);
      res.status(500).send('Internal Server Error');
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('💥 Webhook handler error:', error);
    res.status(500).send('Internal Server Error');
  }
};
