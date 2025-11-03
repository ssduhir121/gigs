// controllers/gigs.js
const Gig = require('../models/Gig');
const Share = require('../models/Share');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const crypto = require('crypto');

// @desc    Get all gigs
// @route   GET /api/gigs
// @access  Public
exports.getGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ isActive: true })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public
exports.getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('user', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
exports.createGig = async (req, res, next) => {
  console.log(req.body)
  try {
    req.body.user = req.user.id;

    const gig = await Gig.create(req.body);

    // Create Stripe payment intent
    const amountPerShare = gig.budget / gig.sharesRequired;
    const totalAmount = Math.round(amountPerShare * gig.sharesRequired * 100); // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        gigId: gig._id.toString(),
        userId: req.user.id
      },
      description: `Payment for gig: ${gig.title}`
    });

    gig.paymentIntentId = paymentIntent.id;
    await gig.save();

    res.status(201).json({
      success: true,
      data: gig,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate unique share URL for a gig
// @route   POST /api/gigs/:id/generate-share-url
// @access  Private
// In your gigs controller
exports.generateShareUrl = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (!gig.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer active'
      });
    }

    // Check if user already has a share URL for this gig
    const existingShare = await Share.findOne({
      gig: gig._id,
      user: req.user.id
    });

    let share;

    if (existingShare) {
      share = existingShare;
    } else {
      // Generate unique tracking token
      const trackingToken = crypto.randomBytes(16).toString('hex');
      
      // Create share record with tracking token
      share = await Share.create({
        gig: gig._id,
        user: req.user.id,
        trackingToken: trackingToken,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    }

    // Generate the frontend shareable URL - FIX THIS PART
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const shareUrl = `${frontendUrl}/track-share/${share.trackingToken}`;

    console.log('Generated share URL:', shareUrl); // Debug log

    res.status(200).json({
      success: true,
      data: {
        shareUrl: shareUrl,
        gigTitle: gig.title,
        gigLink: gig.link,
        trackingToken: share.trackingToken
      },
      message: 'Share URL generated successfully'
    });
  } catch (error) {
    console.error('Error generating share URL:', error);
    next(error);
  }
};

// @desc    Track share click and process payment
// @route   GET /api/track-share/:trackingToken
// @access  Public
// exports.trackShareClick = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { trackingToken } = req.params;

//     // Find the share record
//     const share = await Share.findOne({ trackingToken })
//       .populate('gig')
//       .populate('user')
//       .session(session);

//     if (!share) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: 'Invalid share link'
//       });
//     }

//     const gig = share.gig;

//     if (!gig.isActive) {
//       await session.abortTransaction();
//       return res.redirect(`${process.env.FRONTEND_URL}/gig-completed`);
//     }

//     // Check if this click is from a unique visitor
//     const visitorId = req.ip + req.get('User-Agent');
//     const visitorHash = crypto.createHash('md5').update(visitorId).digest('hex');

//     const isUniqueClick = !share.uniqueVisitors.includes(visitorHash);

//     // Update share stats
//     share.totalClicks += 1;
    
//     if (isUniqueClick) {
//       share.uniqueClicks += 1;
//       share.uniqueVisitors.push(visitorHash);
//     }

//     await share.save({ session });

//     // Only process payment for unique clicks that haven't been paid yet
//     if (isUniqueClick && !share.isPaid && gig.sharesCompleted < gig.sharesRequired) {
//       // Calculate amount per share
//       const amountPerShare = gig.budget / gig.sharesRequired;

//       // Calculate platform fee and user earnings
//       const { userEarning, platformFee } = calculateEarnings(amountPerShare);

//       // Update share with payment info
//       share.amountEarned = userEarning;
//       share.platformFee = platformFee;
//       share.totalAmount = amountPerShare;
//       share.isPaid = true;

//       // Get current user with session to ensure we have latest balance
//       const currentUser = await User.findById(share.user._id).session(session);
//       const newUserBalance = currentUser.walletBalance + userEarning;

//       // Update user's wallet (sharer)
//       await User.findByIdAndUpdate(
//         share.user._id,
//         { $inc: { walletBalance: userEarning } },
//         { session }
//       );

//       // Create transaction record for sharer
//       await Transaction.create([{
//         user: share.user._id,
//         gig: gig._id,
//         share: share._id,
//         type: 'credit',
//         amount: userEarning,
//         description: `Earnings from sharing gig: ${gig.title}`,
//         balanceAfter: newUserBalance,
//         metadata: {
//           platformFee: platformFee,
//           userEarning: userEarning,
//           totalAmount: amountPerShare,
//           uniqueClick: true
//         }
//       }], { session });

//       // Update admin wallet (platform fee)
//       const adminUser = await User.findOne({ role: 'admin' }).session(session);
//       if (adminUser) {
//         const newAdminBalance = adminUser.walletBalance + platformFee;
        
//         await User.findByIdAndUpdate(
//           adminUser._id,
//           { $inc: { walletBalance: platformFee } },
//           { session }
//         );

//         // Create transaction record for admin
//         await Transaction.create([{
//           user: adminUser._id,
//           gig: gig._id,
//           share: share._id,
//           type: 'credit',
//           amount: platformFee,
//           description: `Platform fee from gig: ${gig.title}`,
//           balanceAfter: newAdminBalance,
//           metadata: {
//             platformFee: platformFee,
//             userEarning: userEarning,
//             totalAmount: amountPerShare
//           }
//         }], { session });
//       }

//       // Update gig stats
//       gig.sharesCompleted += 1;
//       gig.totalClicks += 1;

//       // Check if gig is completed
//       if (gig.sharesCompleted >= gig.sharesRequired) {
//         gig.isActive = false;
//       }

//       await gig.save({ session });
//     }

//     await share.save({ session });
//     await session.commitTransaction();

//     // Redirect to the actual gig link
//     res.redirect(gig.link);

//   } catch (error) {
//     await session.abortTransaction();
//     console.error('Track share error:', error);
    
//     // Even if there's an error, still redirect to the gig link
//     try {
//       const share = await Share.findOne({ trackingToken: req.params.trackingToken }).populate('gig');
//       if (share && share.gig) {
//         return res.redirect(share.gig.link);
//       }
//     } catch (fallbackError) {
//       // If everything fails, redirect to home page
//       return res.redirect(process.env.FRONTEND_URL);
//     }
    
//     res.redirect(process.env.FRONTEND_URL);
//   } finally {
//     session.endSession();
//   }
// };

exports.trackShareClick = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { trackingToken } = req.params;

    console.log('🔗 Tracking share with token:', trackingToken);
    console.log('🌐 Request from IP:', req.ip);
    console.log('🖥️ User Agent:', req.get('User-Agent'));

    // Find the share record
    const share = await Share.findOne({ trackingToken })
      .populate('gig')
      .populate('user')
      .session(session);

    if (!share) {
      await session.abortTransaction();
      console.log('❌ Share not found for token:', trackingToken);
      return res.status(404).json({
        success: false,
        message: 'Invalid share link',
        gigLink: null
      });
    }

    const gig = share.gig;
    console.log('🎯 Found gig:', gig.title);

    if (!gig.isActive) {
      await session.abortTransaction();
      console.log('⏹️ Gig is not active:', gig.title);
      return res.status(400).json({
        success: false,
        message: 'This gig is no longer active',
        gigLink: gig.link
      });
    }

    // Check if this click is from a unique visitor
    const visitorId = req.ip + req.get('User-Agent');
    const visitorHash = crypto.createHash('md5').update(visitorId).digest('hex');

    const isUniqueClick = !share.uniqueVisitors.includes(visitorHash);

    console.log('👤 Visitor hash:', visitorHash);
    console.log('🆕 Unique click:', isUniqueClick);
    console.log('📊 Previous unique visitors:', share.uniqueVisitors.length);

    // Update share stats
    share.totalClicks += 1;
    
    if (isUniqueClick) {
      share.uniqueClicks += 1;
      share.uniqueVisitors.push(visitorHash);
    }

    await share.save({ session });

    let earnedMoney = false;
    let earningsAmount = 0;

    // Only process payment for unique clicks that haven't been paid yet
    if (isUniqueClick && !share.isPaid && gig.sharesCompleted < gig.sharesRequired) {
      console.log('💰 Processing payment for unique click');
      
      // Calculate amount per share
      const amountPerShare = gig.budget / gig.sharesRequired;

      // Calculate platform fee and user earnings
      const { userEarning, platformFee } = calculateEarnings(amountPerShare);

      console.log('💵 Amount per share:', amountPerShare);
      console.log('👤 User earning:', userEarning);
      console.log('🏢 Platform fee:', platformFee);

      // Update share with payment info
      share.amountEarned = userEarning;
      share.platformFee = platformFee;
      share.totalAmount = amountPerShare;
      share.isPaid = true;

      // Get current user with session to ensure we have latest balance
      const currentUser = await User.findById(share.user._id).session(session);
      const newUserBalance = currentUser.walletBalance + userEarning;

      console.log('👤 Sharer:', share.user.name);
      console.log('💰 Old balance:', currentUser.walletBalance);
      console.log('💰 New balance:', newUserBalance);

      // Update user's wallet (sharer)
      await User.findByIdAndUpdate(
        share.user._id,
        { $inc: { walletBalance: userEarning } },
        { session }
      );

      // Create transaction record for sharer
      await Transaction.create([{
        user: share.user._id,
        gig: gig._id,
        share: share._id,
        type: 'credit',
        amount: userEarning,
        description: `Earnings from sharing gig: ${gig.title}`,
        balanceAfter: newUserBalance,
        metadata: {
          platformFee: platformFee,
          userEarning: userEarning,
          totalAmount: amountPerShare,
          uniqueClick: true
        }
      }], { session });

      // Update admin wallet (platform fee)
      const adminUser = await User.findOne({ role: 'admin' }).session(session);
      if (adminUser) {
        const newAdminBalance = adminUser.walletBalance + platformFee;
        
        await User.findByIdAndUpdate(
          adminUser._id,
          { $inc: { walletBalance: platformFee } },
          { session }
        );

        // Create transaction record for admin
        await Transaction.create([{
          user: adminUser._id,
          gig: gig._id,
          share: share._id,
          type: 'credit',
          amount: platformFee,
          description: `Platform fee from gig: ${gig.title}`,
          balanceAfter: newAdminBalance,
          metadata: {
            platformFee: platformFee,
            userEarning: userEarning,
            totalAmount: amountPerShare
          }
        }], { session });
      }

      // Update gig stats
      gig.sharesCompleted += 1;
      gig.totalClicks += 1;

      console.log('📈 Gig progress:', gig.sharesCompleted + '/' + gig.sharesRequired);

      // Check if gig is completed
      if (gig.sharesCompleted >= gig.sharesRequired) {
        gig.isActive = false;
        console.log('🎉 Gig completed!');
      }

      await gig.save({ session });
      
      earnedMoney = true;
      earningsAmount = userEarning;
    } else {
      console.log('ℹ️ No payment processed - reasons:');
      console.log('  - Unique click:', isUniqueClick);
      console.log('  - Already paid:', share.isPaid);
      console.log('  - Gig completed:', gig.sharesCompleted >= gig.sharesRequired);
    }

    await share.save({ session });
    await session.commitTransaction();

    console.log('✅ Share tracked successfully');
    console.log('🔗 Gig link:', gig.link);

    // Return JSON response instead of redirecting
    res.status(200).json({
      success: true,
      data: {
        gigLink: gig.link,
        gigTitle: gig.title,
        tracked: true,
        earnedMoney: earnedMoney,
        earningsAmount: earningsAmount,
        isUniqueClick: isUniqueClick,
        gigActive: gig.isActive
      },
      message: earnedMoney ? `Earned $${earningsAmount.toFixed(2)} from this share!` : 'Share tracked successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Track share error:', error);
    
    // Return error in JSON format
    res.status(500).json({
      success: false,
      message: 'Error tracking share',
      gigLink: null
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get my gigs
// @route   GET /api/gigs/my-gigs
// @access  Private
exports.getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my shares
// @route   GET /api/gigs/my-shares
// @access  Private
exports.getMyShares = async (req, res, next) => {
  try {
    const shares = await Share.find({ user: req.user.id })
      .populate('gig', 'title budget sharesRequired')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shares.length,
      data: shares
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate earnings based on your fee structure
function calculateEarnings(amountPerShare) {
  let platformFee, userEarning;

  if (amountPerShare < 2) {
    // Flat $0.30 fee for amounts less than $2
    platformFee = 0.30;
    userEarning = amountPerShare - platformFee;
  } else {
    // 6.5% + $0.60 fee for amounts $2 and above
    const percentageFee = amountPerShare * 0.065;
    platformFee = percentageFee + 0.60;
    userEarning = amountPerShare - platformFee;
  }

  // Ensure user earning is not negative
  userEarning = Math.max(userEarning, 0);

  return {
    userEarning: parseFloat(userEarning.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2))
  };
}


// In your gigs controller
// In your gigs controller
exports.createGigWithWallet = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description, link, budget, sharesRequired } = req.body;
    
    // Check if user has sufficient balance
    const user = await User.findById(req.user.id).session(session);
    
    if (user.walletBalance < budget) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Create gig
    const gig = await Gig.create([{
      title,
      description,
      link,
      budget,
      sharesRequired,
      user: req.user.id,
      isActive: true, // Activate immediately since payment is from wallet
      paymentMethod: 'wallet'
    }], { session });

    // Deduct from user's wallet
    const newBalance = user.walletBalance - budget;
    await User.findByIdAndUpdate(
      req.user.id,
      { walletBalance: newBalance },
      { session }
    );

    // Create transaction record - FIX: Include gig field
    await Transaction.create([{
      user: req.user.id,
      gig: gig[0]._id, // Add this line - reference the created gig
      type: 'debit',
      amount: budget,
      description: `Payment for gig: ${title}`,
      balanceAfter: newBalance,
      metadata: {
        gigId: gig[0]._id,
        paymentMethod: 'wallet'
      }
    }], { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: gig[0],
      newBalance: newBalance,
      message: 'Gig created successfully using wallet balance'
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};



// @desc    Get share details by tracking token
// @route   GET /api/gigs/shares/:trackingToken
// @access  Private
exports.getShareByToken = async (req, res, next) => {
  try {
    const share = await Share.findOne({ trackingToken: req.params.trackingToken })
      .populate('gig', 'title link budget sharesRequired sharesCompleted isActive')
      .populate('user', 'name email');
    
    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Share not found'
      });
    }

    // Check if the current user is the owner of this share
    if (share.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own shares.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        share: {
          _id: share._id,
          trackingToken: share.trackingToken,
          totalClicks: share.totalClicks,
          uniqueClicks: share.uniqueClicks,
          amountEarned: share.amountEarned,
          isPaid: share.isPaid,
          createdAt: share.createdAt
        },
        gig: share.gig
      }
    });
  } catch (error) {
    console.error('Error fetching share details:', error);
    next(error);
  }
};