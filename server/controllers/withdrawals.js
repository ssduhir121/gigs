// controllers/withdrawals.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const { payoutsClient } = require('../utils/paypalPayoutsClient'); // Import payouts client

/**
 * Create a withdrawal (wallet or PayPal) with PayPal linking
 */
const createWithdrawal = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, paymentMethod, paypalEmail } = req.body;

    if (!amount || parseFloat(amount) < 5) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Minimum withdrawal is $5' });
    }

    const user = await User.findById(req.user.id).session(session);
    const withdrawAmount = parseFloat(amount);

    if (!user) throw new Error('User not found');

    // Check sufficient balance
    const currentBalance = user.getWalletBalance();
    if (currentBalance < withdrawAmount) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // WALLET withdrawal
    if (paymentMethod === 'wallet') {
      // Deduct from wallet
      const newBalance = parseFloat((currentBalance - withdrawAmount).toFixed(2));
      user.walletBalance = newBalance;
      await user.save({ session });

      // Create withdrawal record
      const withdrawal = await Withdrawal.create(
        [
          {
            user: user._id,
            amount: withdrawAmount,
            paymentMethod: 'wallet',
            status: 'completed',
            userEmail: user.email,
            userName: user.name,
            processedAt: new Date(),
          },
        ],
        { session }
      );

      // Record transaction
      await Transaction.create(
        [
          {
            user: user._id,
            type: 'debit',
            amount: withdrawAmount,
            balanceAfter: newBalance,
            description: 'Wallet withdrawal',
            paymentProvider: 'Wallet',
            status: 'completed',
            metadata: { method: 'wallet' },
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return res.status(200).json({ 
        success: true, 
        message: 'Wallet withdrawal successful', 
        withdrawal: withdrawal[0] 
      });
    }

    // PAYPAL withdrawal with linking
    if (paymentMethod === 'paypal') {
      let payoutEmail;

      // ✅ SCENARIO 1: User provides PayPal email during withdrawal (LINKING)
      if (paypalEmail) {
        payoutEmail = paypalEmail;
        
        // Validate email format
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(paypalEmail)) {
          await session.abortTransaction();
          return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid PayPal email address' 
          });
        }

        // Save this email for future withdrawals
        user.paypalEmail = paypalEmail;
        user.paypalVerified = false;
        user.withdrawalMethod = 'paypal';
        await user.save({ session });
        
        console.log('🔗 New PayPal email linked during withdrawal:', payoutEmail);
        
      } 
      // ✅ SCENARIO 2: Use previously linked PayPal email
      else if (user.paypalEmail) {
        payoutEmail = user.paypalEmail;
        console.log('✅ Using linked PayPal email:', payoutEmail);
        
      } 
      // ✅ SCENARIO 3: No PayPal email linked - ask user to link
      else {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'No PayPal account linked for withdrawal',
          actionRequired: true,
          action: 'link_paypal',
          data: {
            message: 'Please link your PayPal account to withdraw funds',
            minimumAmount: 5,
            canLinkNow: true,
            currentBalance: currentBalance
          }
        });
      }

      // Process PayPal payout using Payouts SDK
      const senderBatchId = `withdraw-${Date.now()}-${user._id}`;
      
      const requestBody = {
        sender_batch_header: {
          sender_batch_id: senderBatchId,
          email_subject: 'Withdrawal from GigShare Platform',
          email_message: `You have received a withdrawal of $${withdrawAmount.toFixed(2)} from your GigShare earnings.`,
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: { 
              value: withdrawAmount.toFixed(2), 
              currency: 'USD' 
            },
            receiver: payoutEmail,
            note: `Withdrawal from GigShare - ${user.name}`,
            sender_item_id: `withdrawal-${Date.now()}`,
          },
        ],
      };

      console.log('🚀 Creating PayPal payout request...');
      
      try {
        // Use the Payouts SDK
        const paypal = require('@paypal/payouts-sdk');
        const request = new paypal.payouts.PayoutsPostRequest();
        request.requestBody(requestBody);
        
        const payoutResponse = await payoutsClient().execute(request);

        // Deduct from wallet
        const newBalance = parseFloat((currentBalance - withdrawAmount).toFixed(2));
        user.walletBalance = newBalance;
        await user.save({ session });

        // Create withdrawal record
        const withdrawal = await Withdrawal.create([{
          user: user._id,
          amount: withdrawAmount,
          paymentMethod: 'paypal',
          status: 'processing',
          payoutBatchId: payoutResponse.result.batch_header.payout_batch_id,
          userEmail: user.email,
          paypalEmail: payoutEmail,
          userName: user.name,
          batchStatus: payoutResponse.result.batch_header.batch_status,
        }], { session });

        // Record transaction
        await Transaction.create([{
          user: user._id,
          type: 'debit',
          amount: withdrawAmount,
          balanceAfter: newBalance,
          description: `PayPal withdrawal to ${payoutEmail}`,
          paymentProvider: 'PayPal',
          status: 'completed',
          metadata: { 
            method: 'paypal',
            paypalEmail: payoutEmail,
            payoutBatchId: payoutResponse.result.batch_header.payout_batch_id,
            batchStatus: payoutResponse.result.batch_header.batch_status,
            senderBatchId: senderBatchId
          },
        }], { session });

        await session.commitTransaction();
        
        console.log('✅ PayPal withdrawal processed successfully');
        
        return res.status(200).json({
          success: true,
          message: `Withdrawal processing. $${withdrawAmount.toFixed(2)} sent to ${payoutEmail}`,
          withdrawal: withdrawal[0],
          data: {
            paypalEmail: payoutEmail,
            payoutBatchId: payoutResponse.result.batch_header.payout_batch_id,
            newBalance: newBalance,
            isNewPaypalLinked: !!paypalEmail
          }
        });

      } catch (paypalError) {
        await session.abortTransaction();
        console.error('❌ PayPal payout error:', paypalError);
        
        // Handle specific PayPal errors
        if (paypalError.statusCode === 422) {
          const issue = paypalError.details?.[0]?.issue;
          
          if (issue === 'RECEIVER_UNREGISTERED') {
            return res.status(400).json({
              success: false,
              message: 'PayPal email is not registered with PayPal. Please use a different email or create a PayPal account.',
              paypalEmail: payoutEmail,
              canRetry: true
            });
          }
          
          if (issue === 'INSUFFICIENT_FUNDS') {
            return res.status(400).json({
              success: false,
              message: 'Platform has insufficient funds. Please try again later or contact support.',
              canRetry: true
            });
          }
        }
        
        // Generic PayPal error
        return res.status(400).json({
          success: false,
          message: 'PayPal payout failed. Please try again or use a different email.',
          paypalEmail: payoutEmail,
          canRetry: true
        });
      }
    }

    await session.abortTransaction();
    return res.status(400).json({ success: false, message: 'Invalid payment method' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Withdrawal error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};


/**
 * Get user's withdrawals
 */
const getMyWithdrawals = async (req, res, next) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: withdrawals.length, data: withdrawals });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's PayPal linking status
 */
const getPaypalStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('paypalEmail paypalVerified withdrawalMethod email');
    
    res.status(200).json({
      success: true,
      data: {
        paypalLinked: !!user.paypalEmail,
        paypalEmail: user.paypalEmail,
        paypalVerified: user.paypalVerified,
        withdrawalMethod: user.withdrawalMethod,
        accountEmail: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Link PayPal account separately (not during withdrawal)
 */
const linkPaypalAccount = async (req, res, next) => {
  try {
    const { paypalEmail } = req.body;
    const user = await User.findById(req.user.id);

    if (!paypalEmail) {
      return res.status(400).json({
        success: false,
        message: 'PayPal email is required'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(paypalEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid PayPal email address'
      });
    }

    // Update user with PayPal email
    user.paypalEmail = paypalEmail;
    user.paypalVerified = false;
    user.withdrawalMethod = 'paypal';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'PayPal account linked successfully!',
      data: {
        paypalEmail: user.paypalEmail,
        paypalVerified: user.paypalVerified,
        withdrawalMethod: user.withdrawalMethod
      }
    });

  } catch (error) {
    console.error('PayPal linking error:', error);
    next(error);
  }
};

module.exports = {
  createWithdrawal,
  getMyWithdrawals,
  getPaypalStatus,
  linkPaypalAccount
};