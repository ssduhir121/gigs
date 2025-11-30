// controllers/submissionController.js
const Share = require('../models/Share');
const Gig = require('../models/Gig');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const NotificationService = require('../utils/notificationService');

const mongoose = require('mongoose');

// Submit proof of sharing
exports.submitProof = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shareId } = req.params;
    const { images, description } = req.body;
    const userId = req.user.id;

    // Find the share
    const share = await Share.findById(shareId).session(session);
    if (!share) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Share not found' });
    }

    // Verify ownership
    if (share.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if already submitted or approved
    if (share.submissionStatus === 'submitted') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Proof already submitted and under review' });
    }

    if (share.submissionStatus === 'approved') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Proof already approved' });
    }

    // Update share with submission
    share.submissionStatus = 'submitted';
    share.submittedAt = new Date();
    share.submissionProof = images.map(img => ({
      imageUrl: img.url,
      description: description,
      submittedAt: new Date(),
      status: 'pending'
    }));

    await share.save({ session });
    await session.commitTransaction();

  try {
      const gig = await require('../models/Gig').findById(share.gig);
      const sharer = await require('../models/User').findById(userId);
      await NotificationService.notifySubmissionReceived(share, gig, sharer);
    } catch (notifyError) {
      console.error('Failed to send submission notification:', notifyError);
    }

  try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Proof Submitted',
        message: 'Your proof has been submitted and is under review.',
        data: {
          shareId: share._id,
          metadata: {
            status: 'submitted'
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Failed to send submission confirmation:', notifyError);
    }


    res.status(200).json({
      success: true,
      message: 'Proof submitted successfully. Waiting for approval.',
      data: share
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Approve submission (for gig owners)
exports.approveSubmission = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shareId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    console.log('🔍 Starting approval process for share:', shareId);

    // Find the share with gig and user populated
    const share = await Share.findById(shareId)
      .populate('gig')
      .populate('user') // Populate the sharer
      .session(session);

    if (!share) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Share not found' });
    }

    console.log('📋 Share found:', {
      shareId: share._id,
      gigId: share.gig?._id,
      sharerId: share.user?._id,
      sharerName: share.user?.name,
      submissionStatus: share.submissionStatus
    });

    // Verify gig ownership
    if (share.gig.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: 'Only gig owner can approve submissions' });
    }

    // Check if already processed
    if (share.submissionStatus === 'approved') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Submission already approved' });
    }

    if (share.submissionStatus !== 'submitted') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'No pending submission found' });
    }

    const gig = share.gig;
    const sharer = share.user;

    // Calculate earnings
    const amountPerShare = gig.availableFunds / gig.sharesRequired;
    const userEarning = parseFloat(amountPerShare.toFixed(2));

    console.log('💰 Payment calculation:', {
      gigTitle: gig.title,
      availableFunds: gig.availableFunds,
      sharesRequired: gig.sharesRequired,
      sharesCompleted: gig.sharesCompleted,
      amountPerShare: amountPerShare,
      userEarning: userEarning
    });

    // Check if funds are available
    if (gig.availableFunds < userEarning) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient funds in gig budget. Available: $${gig.availableFunds}, Required: $${userEarning}` 
      });
    }

    // Get current sharer balance
    const currentUser = await User.findById(sharer._id).session(session);
    const currentBalance = parseFloat(currentUser.walletBalance?.toString()) || 0;
    const newBalance = parseFloat((currentBalance + userEarning).toFixed(2));

    console.log('💳 Wallet update details:', {
      sharerId: sharer._id,
      sharerName: sharer.name,
      currentBalance: currentBalance,
      userEarning: userEarning,
      newBalance: newBalance
    });

    // Update sharer wallet
    await User.findByIdAndUpdate(
      sharer._id,
      { $set: { walletBalance: newBalance } },
      { session }
    );

    console.log('✅ Wallet updated successfully');

    // Update share status
    share.submissionStatus = 'approved';
    share.approvedAt = new Date();
    share.amountEarned = userEarning;
    share.isPaid = true;
    share.paidAt = new Date();
    
    if (share.submissionProof && share.submissionProof.length > 0) {
      share.submissionProof[0].status = 'approved';
      share.submissionProof[0].verifiedAt = new Date();
      share.submissionProof[0].verifiedBy = userId;
      share.submissionProof[0].verificationNotes = notes || 'Approved by gig owner';
    }

    // Update gig progress and deduct funds
    gig.sharesCompleted = (gig.sharesCompleted || 0) + 1;
    gig.availableFunds = parseFloat((gig.availableFunds - userEarning).toFixed(2));

    console.log('📊 Gig progress updated:', {
      sharesCompleted: gig.sharesCompleted,
      remainingShares: gig.sharesRequired - gig.sharesCompleted,
      newAvailableFunds: gig.availableFunds
    });

    // Check if gig is completed
    if (gig.sharesCompleted >= gig.sharesRequired) {
      gig.isActive = false;
      console.log(`🎯 Gig ${gig._id} completed all shares and is now inactive`);
    }

    await share.save({ session });
    await gig.save({ session });

    console.log('💾 Share and gig saved successfully');

    // Create transaction record
    await Transaction.create([{
      user: sharer._id,
      gig: gig._id,
      share: share._id,
      type: 'credit',
      amount: userEarning,
      description: `Earnings from sharing gig: ${gig.title}`,
      balanceAfter: newBalance,
      metadata: {
        submissionApproved: true,
        approvedBy: userId,
        approvedAt: new Date(),
        notes: notes,
        contentType: gig.contentType,
        gigOwner: userId
      }
    }], { session });

    console.log('📝 Transaction created successfully');

    await session.commitTransaction();
    console.log('✅ Transaction committed successfully');

    try {
      await NotificationService.notifySubmissionApproved(share, gig, userEarning);
    } catch (notifyError) {
      console.error('Failed to send approval notification:', notifyError);
    }

        try {
      await NotificationService.createNotification({
        userId: userId, // gig owner
        type: 'system_announcement',
        title: 'Submission Approved',
        message: `You approved ${sharer.name}'s submission for "${gig.title}"`,
        data: {
          shareId: share._id,
          amount: userEarning,
          metadata: {
            sharerName: sharer.name,
            gigTitle: gig.title
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Failed to send approval confirmation:', notifyError);
    }


      if (!gig.isActive) {
      try {
        await NotificationService.createNotification({
          userId: gig.user,
          type: 'gig_completed',
          title: 'Gig Completed!',
          message: `Your gig "${gig.title}" has been completed with ${gig.sharesCompleted} shares.`,
          data: {
            gigId: gig._id,
            metadata: {
              sharesCompleted: gig.sharesCompleted,
              totalBudget: gig.budget
            }
          },
          priority: 'medium'
        });
      } catch (notifyError) {
        console.error('Failed to send gig completion notification:', notifyError);
      }
    }

    // Verify the wallet update worked
    const updatedUser = await User.findById(sharer._id);
    console.log('🔍 Final wallet verification:', {
      sharerName: updatedUser.name,
      finalBalance: updatedUser.walletBalance
    });

    res.status(200).json({
      success: true,
      message: 'Submission approved and payment processed',
      data: {
        share,
        amountEarned: userEarning,
        sharer: {
          name: sharer.name,
          newBalance: newBalance
        }
      }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Error approving submission:', error);
    console.error('Error stack:', error.stack);
    next(error);
  } finally {
    session.endSession();
  }
};

// Reject submission (for gig owners)
exports.rejectSubmission = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shareId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const share = await Share.findById(shareId)
      .populate('gig')
      .session(session);

    if (!share) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Share not found' });
    }

    // Verify gig ownership
    if (share.gig.user.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({ success: false, message: 'Only gig owner can reject submissions' });
    }

    if (share.submissionStatus !== 'submitted') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'No pending submission found' });
    }

    // Update share status
    share.submissionStatus = 'rejected';
    share.rejectedAt = new Date();
    share.submissionProof[0].status = 'rejected';
    share.submissionProof[0].verifiedAt = new Date();
    share.submissionProof[0].verifiedBy = userId;
    share.submissionProof[0].verificationNotes = reason || 'Submission rejected';

    await share.save({ session });
    await session.commitTransaction();

        try {
      await NotificationService.notifySubmissionRejected(share, share.gig, reason);
    } catch (notifyError) {
      console.error('Failed to send rejection notification:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: 'Submission rejected',
      data: share
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get submissions for a gig (for gig owners)
exports.getGigSubmissions = async (req, res, next) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id;

    // Verify gig ownership
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    if (gig.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const submissions = await Share.find({ gig: gigId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: submissions
    });

  } catch (error) {
    next(error);
  }
};