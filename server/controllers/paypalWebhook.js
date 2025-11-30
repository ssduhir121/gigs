// // controllers/paypalWebhook.js
// const Withdrawal = require('../models/Withdrawal');
// const mongoose = require('mongoose');

// exports.handleWebhook = async (req, res) => {
//   try {
//     const event = req.body;

//     console.log('💡 PayPal Webhook Event:', event.event_type);

//     // Ensure event and resource are valid
//     if (!event || !event.resource) {
//       console.warn('⚠️ Invalid webhook payload');
//       return res.status(400).send('Invalid webhook payload');
//     }

//     const payoutItem = event.resource;
//     const batchId = payoutItem.payout_batch_id;

//     if (!batchId) {
//       console.warn('⚠️ Missing payout_batch_id in webhook payload');
//       return res.status(400).send('Missing payout_batch_id');
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const withdrawal = await Withdrawal.findOne({ payoutBatchId: batchId }).session(session);

//       if (!withdrawal) {
//         console.warn('❌ Withdrawal not found for batch:', batchId);
//         await session.abortTransaction();
//         return res.status(404).send('Withdrawal not found');
//       }

//       // Update withdrawal based on event type
//       switch (event.event_type) {
//         case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
//           withdrawal.status = 'completed';
//           withdrawal.processedAt = new Date();
//           break;
//         case 'PAYMENT.PAYOUTS-ITEM.FAILED':
//           withdrawal.status = 'failed';
//           withdrawal.failureReason = payoutItem.errors?.name || 'Unknown';
//           withdrawal.processedAt = new Date();
//           break;
//         case 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED':
//           withdrawal.status = 'pending';
//           withdrawal.processedAt = null;
//           break;
//         default:
//           console.log('ℹ️ Unhandled PayPal event type:', event.event_type);
//           break;
//       }

//       await withdrawal.save({ session });
//       await session.commitTransaction();

//       res.status(200).send('Webhook processed successfully');
//     } catch (err) {
//       await session.abortTransaction();
//       console.error('💥 Webhook DB error:', err);
//       res.status(500).send('Internal Server Error');
//     } finally {
//       session.endSession();
//     }
//   } catch (error) {
//     console.error('💥 Webhook handler error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };



// controllers/paypalWebhook.js
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const NotificationService = require('../utils/notificationService');
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
      const withdrawal = await Withdrawal.findOne({ payoutBatchId: batchId })
        .populate('user')
        .session(session);

      if (!withdrawal) {
        console.warn('❌ Withdrawal not found for batch:', batchId);
        await session.abortTransaction();
        return res.status(404).send('Withdrawal not found');
      }

      // Store previous status for notification
      const previousStatus = withdrawal.status;
      
      // Update withdrawal based on event type
      switch (event.event_type) {
        case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
          withdrawal.status = 'completed';
          withdrawal.processedAt = new Date();
          withdrawal.failureReason = null; // Clear any previous failure reason
          console.log(`✅ Withdrawal ${withdrawal._id} marked as COMPLETED`);
          break;
          
        case 'PAYMENT.PAYOUTS-ITEM.FAILED':
          withdrawal.status = 'failed';
          withdrawal.failureReason = payoutItem.errors?.name || 'Payment processor rejected the payout';
          withdrawal.processedAt = new Date();
          console.log(`❌ Withdrawal ${withdrawal._id} marked as FAILED: ${withdrawal.failureReason}`);
          
          // Refund amount to user's wallet if payout failed
          await User.findByIdAndUpdate(
            withdrawal.user._id,
            { $inc: { walletBalance: withdrawal.amount } },
            { session }
          );
          
          // Create refund transaction
          const user = await User.findById(withdrawal.user._id).session(session);
          await Transaction.create([{
            user: withdrawal.user._id,
            type: 'credit',
            amount: withdrawal.amount,
            description: `Withdrawal refund: ${withdrawal.failureReason}`,
            balanceAfter: user.walletBalance + withdrawal.amount,
            metadata: {
              withdrawalId: withdrawal._id,
              refundReason: withdrawal.failureReason,
              payoutBatchId: batchId,
              webhookEvent: event.event_type
            }
          }], { session });
          break;
          
        case 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED':
          withdrawal.status = 'pending';
          withdrawal.failureReason = 'Payment unclaimed - recipient may need to claim funds';
          withdrawal.processedAt = null;
          console.log(`⚠️ Withdrawal ${withdrawal._id} marked as UNCLAIMED`);
          break;
          
        case 'PAYMENT.PAYOUTS-ITEM.BLOCKED':
          withdrawal.status = 'pending';
          withdrawal.failureReason = 'Payment blocked - requires manual review';
          withdrawal.processedAt = null;
          console.log(`🚫 Withdrawal ${withdrawal._id} marked as BLOCKED`);
          break;
          
        case 'PAYMENT.PAYOUTS-ITEM.RETURNED':
          withdrawal.status = 'failed';
          withdrawal.failureReason = 'Payment returned - recipient account issue';
          withdrawal.processedAt = new Date();
          console.log(`↩️ Withdrawal ${withdrawal._id} marked as RETURNED`);
          break;
          
        default:
          console.log('ℹ️ Unhandled PayPal event type:', event.event_type);
          break;
      }

      await withdrawal.save({ session });
      await session.commitTransaction();

      // 🔔 NOTIFICATION: Send appropriate notification based on status change
      if (withdrawal.status !== previousStatus) {
        await sendWithdrawalStatusNotification(withdrawal, event.event_type);
      }

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

// Helper function to send withdrawal status notifications
async function sendWithdrawalStatusNotification(withdrawal, eventType) {
  try {
    let title, message, notificationType, priority;

    switch (eventType) {
      case 'PAYMENT.PAYOUTS-ITEM.SUCCEEDED':
        title = 'Withdrawal Completed!';
        message = `Your withdrawal of $${withdrawal.amount} has been successfully processed and sent to your PayPal account.`;
        notificationType = 'withdrawal_processed';
        priority = 'high';
        break;
        
      case 'PAYMENT.PAYOUTS-ITEM.FAILED':
        title = 'Withdrawal Failed';
        message = `Your withdrawal of $${withdrawal.amount} failed. Reason: ${withdrawal.failureReason}. Amount has been refunded to your wallet.`;
        notificationType = 'withdrawal_failed';
        priority = 'high';
        break;
        
      case 'PAYMENT.PAYOUTS-ITEM.UNCLAIMED':
        title = 'Withdrawal Pending - Action Required';
        message = `Your withdrawal of $${withdrawal.amount} is unclaimed. Please check your PayPal account to claim the funds.`;
        notificationType = 'system_announcement';
        priority = 'medium';
        break;
        
      case 'PAYMENT.PAYOUTS-ITEM.BLOCKED':
        title = 'Withdrawal Under Review';
        message = `Your withdrawal of $${withdrawal.amount} is being reviewed. This may take additional time to process.`;
        notificationType = 'system_announcement';
        priority = 'medium';
        break;
        
      case 'PAYMENT.PAYOUTS-ITEM.RETURNED':
        title = 'Withdrawal Returned';
        message = `Your withdrawal of $${withdrawal.amount} was returned. Please check your PayPal account details.`;
        notificationType = 'withdrawal_failed';
        priority = 'high';
        break;
        
      default:
        title = 'Withdrawal Status Updated';
        message = `Your withdrawal status has been updated to: ${withdrawal.status}`;
        notificationType = 'system_announcement';
        priority = 'medium';
        break;
    }

    // Send notification to user
    await NotificationService.createNotification({
      userId: withdrawal.user._id,
      type: notificationType,
      title: title,
      message: message,
      data: {
        withdrawalId: withdrawal._id,
        amount: withdrawal.amount,
        status: withdrawal.status,
        payoutBatchId: withdrawal.payoutBatchId,
        failureReason: withdrawal.failureReason,
        metadata: {
          eventType: eventType,
          processedAt: withdrawal.processedAt,
          amount: withdrawal.amount.toFixed(2),
          paypalEmail: withdrawal.userEmail
        }
      },
      priority: priority
    });

    // 🔔 NOTIFICATION: Also notify admins for important status changes
    if (['failed', 'unclaimed', 'blocked', 'returned'].includes(withdrawal.status)) {
      const adminUsers = await User.find({ role: 'admin' });
      
      for (const admin of adminUsers) {
        await NotificationService.createNotification({
          userId: admin._id,
          type: 'system_announcement',
          title: `Withdrawal ${withdrawal.status.toUpperCase()}`,
          message: `Withdrawal ${withdrawal._id} for $${withdrawal.amount} to ${withdrawal.userEmail} is now ${withdrawal.status}. Reason: ${withdrawal.failureReason || 'N/A'}`,
          data: {
            withdrawalId: withdrawal._id,
            userId: withdrawal.user._id,
            userName: withdrawal.user.name,
            userEmail: withdrawal.userEmail,
            amount: withdrawal.amount,
            status: withdrawal.status,
            payoutBatchId: withdrawal.payoutBatchId,
            failureReason: withdrawal.failureReason,
            metadata: {
              eventType: eventType,
              requiresAttention: true,
              processedAt: withdrawal.processedAt
            }
          },
          priority: 'medium'
        });
      }
    }

    console.log(`✅ Notification sent for withdrawal ${withdrawal._id} - Status: ${withdrawal.status}`);
  } catch (notifyError) {
    console.error('❌ Failed to send withdrawal status notification:', notifyError);
  }
}

// Additional webhook handler for batch-level events
exports.handleBatchWebhook = async (req, res) => {
  try {
    const event = req.body;

    console.log('💡 PayPal Batch Webhook Event:', event.event_type);

    if (!event || !event.resource) {
      console.warn('⚠️ Invalid batch webhook payload');
      return res.status(400).send('Invalid webhook payload');
    }

    const batch = event.resource;
    const batchId = batch.batch_header?.payout_batch_id;

    if (!batchId) {
      console.warn('⚠️ Missing payout_batch_id in batch webhook');
      return res.status(400).send('Missing payout_batch_id');
    }

    // Handle batch-level events
    switch (event.event_type) {
      case 'PAYMENT.PAYOUTSBATCH.SUCCESS':
        console.log(`✅ Payout batch ${batchId} processed successfully`);
        // You could notify admins about batch completion
        await notifyAdminsAboutBatchCompletion(batchId, 'success');
        break;
        
      case 'PAYMENT.PAYOUTSBATCH.DENIED':
        console.log(`❌ Payout batch ${batchId} was denied`);
        await notifyAdminsAboutBatchCompletion(batchId, 'denied');
        break;
        
      case 'PAYMENT.PAYOUTSBATCH.PROCESSING':
        console.log(`🔄 Payout batch ${batchId} is processing`);
        break;
        
      default:
        console.log('ℹ️ Unhandled batch event type:', event.event_type);
        break;
    }

    res.status(200).send('Batch webhook processed successfully');
  } catch (error) {
    console.error('💥 Batch webhook handler error:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Helper function to notify admins about batch completion
async function notifyAdminsAboutBatchCompletion(batchId, status) {
  try {
    const adminUsers = await User.find({ role: 'admin' });
    const withdrawals = await Withdrawal.find({ payoutBatchId: batchId }).populate('user');
    
    const totalAmount = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const successfulCount = withdrawals.filter(w => w.status === 'completed').length;
    const failedCount = withdrawals.filter(w => w.status === 'failed').length;

    for (const admin of adminUsers) {
      await NotificationService.createNotification({
        userId: admin._id,
        type: 'system_announcement',
        title: `Payout Batch ${status.toUpperCase()}`,
        message: `Payout batch ${batchId} has been ${status}. Total: $${totalAmount.toFixed(2)} | Successful: ${successfulCount} | Failed: ${failedCount}`,
        data: {
          batchId: batchId,
          status: status,
          totalAmount: totalAmount,
          successfulCount: successfulCount,
          failedCount: failedCount,
          totalWithdrawals: withdrawals.length,
          metadata: {
            processedAt: new Date(),
            requiresReview: failedCount > 0
          }
        },
        priority: 'low'
      });
    }
  } catch (error) {
    console.error('❌ Failed to send batch completion notification:', error);
  }
}