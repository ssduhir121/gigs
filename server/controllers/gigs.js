// // controllers/gigs.js
// const Gig = require('../models/Gig');
// const Share = require('../models/Share');
// const User = require('../models/User');
// const Transaction = require('../models/Transaction');
// const mongoose = require('mongoose');
// const crypto = require('crypto');

// const { client: paypalClient, checkoutNodeJssdk } = require('../utils/paypalClient');

// /**
//  * Helper: enforce min gig amount and commission
//  * Commission: 6.5% + $2
//  */

// const getAdminUser = async (session) => {
//   let admin = await User.findOne({ role: 'admin' }).session(session);
//   if (!admin) {
//     // Create admin user if doesn't exist
//     const randomPassword = crypto.randomBytes(16).toString('hex');
//     admin = await User.create([{
//       name: 'Platform Admin',
//       email: 'admin@gigshare.com',
//       password: randomPassword,
//       role: 'admin',
//       walletBalance: 0
//     }], { session });
//     admin = admin[0];
//     console.log('👑 Admin user created automatically');
//   }
//   return admin;
// };

// function computeCommission(totalAmount) {
//   const platformFee = parseFloat((totalAmount * 0.065 + 2).toFixed(2));
//   const availableFunds = parseFloat((totalAmount - platformFee).toFixed(2));
  
//   console.log(`💰 Commission Debug: Total=$${totalAmount}, Fee=$${platformFee}, Available=$${availableFunds}`);
  
//   return { platformFee, availableFunds };
// }

// /**********************
//  * Public endpoints
//  **********************/

// exports.getGigs = async (req, res, next) => {
//   try {
//     const gigs = await Gig.find({ isActive: true })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: gigs.length, data: gigs });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getGig = async (req, res, next) => {
//   try {
//     const gig = await Gig.findById(req.params.id).populate('user', 'name email');

//     if (!gig) {
//       return res.status(404).json({ success: false, message: 'Gig not found' });
//     }

//     res.status(200).json({ success: true, data: gig });
//   } catch (error) {
//     next(error);
//   }
// };

// /**********************
//  * PayPal: create order
//  * (frontend will call this to get an orderId)
//  **********************/
// exports.createPaypalOrder = async (req, res, next) => {
//   try {
//     const { budget } = req.body;

//     if (!budget || parseFloat(budget) < 15) {
//       return res.status(400).json({ success: false, message: 'Minimum gig amount is $15' });
//     }

//     const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
//     request.prefer('return=representation');
//     request.requestBody({
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             currency_code: 'USD',
//             value: parseFloat(budget).toFixed(2)
//           }
//         }
//       ]
//     });

//     const response = await paypalClient().execute(request);
//     const orderId = response.result.id;

//     res.status(200).json({ success: true, data: { orderId } });
//   } catch (error) {
//     console.error('PayPal create order error:', error);
//     next(error);
//   }
// };

// /**********************
//  * PayPal: capture order and create gig atomically
//  * body: { orderId, title, description, link, budget, sharesRequired }
//  **********************/
// exports.capturePaypalOrder = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { orderId, title, description, link, budget, sharesRequired } = req.body;

//     if (!orderId) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Missing orderId' });
//     }

//     if (!budget || parseFloat(budget) < 15) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Minimum gig amount is $15' });
//     }

//     // Capture the order using PayPal SDK
//     const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
//     request.requestBody({});

//     const captureResponse = await paypalClient().execute(request);
//     const capture = captureResponse.result;

//     const status = capture.status; // expect 'COMPLETED'
//     if (status !== 'COMPLETED') {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Payment not completed' });
//     }

//     // Extract payer info (safely)
//     const payer = capture.payer || {};
//     const payerEmail = payer.email_address || (payer?.payer_id || '');

//     // Compute commission
//     const total = parseFloat(budget);
//     const { platformFee, availableFunds } = computeCommission(total);

//     // ✅ FIXED: Use correct fields that exist in Gig model
//     const gigArr = await Gig.create([{
//       title: (title || '').trim(),
//       description: (description || '').trim(),
//       link: (link || '').trim(),
//       budget: total,
//       sharesRequired: parseInt(sharesRequired, 10),
//       user: req.user.id,
//       isActive: true,
//       platformFee,
//       availableFunds,
//       paymentStatus: 'completed',
//       paymentMethod: 'paypal',
//       paypalOrderId: orderId,
//       payerEmail: payerEmail
//     }], { session });

//     const gig = gigArr[0];

//     // Record a transaction (creator payment) for audit
//     await Transaction.create([{
//       user: req.user.id,
//       gig: gig._id,
//       type: 'debit',
//       amount: total,
//       description: `Payment for gig: ${gig.title}`,
//       balanceAfter: undefined,
//       metadata: {
//         paymentMethod: 'paypal',
//         paypalOrderId: orderId,
//         platformFee
//       }
//     }], { session });

//     // Transfer commission to admin
//     const adminUser = await getAdminUser(session);
//     await User.findByIdAndUpdate(
//       adminUser._id,
//       { $inc: { walletBalance: platformFee } },
//       { session }
//     );

//     await Transaction.create([{
//       user: adminUser._id,
//       gig: gig._id,
//       type: 'credit',
//       amount: platformFee,
//       description: `Platform commission from gig: ${gig.title}`,
//       balanceAfter: adminUser.walletBalance + platformFee,
//       metadata: {
//         paymentMethod: 'paypal',
//         commissionType: 'platform_fee',
//         gigBudget: total,
//         payerEmail: payerEmail
//       }
//     }], { session });

//     console.log(`💰 Commission $${platformFee} transferred to admin wallet`);

//     await session.commitTransaction();

//     res.status(201).json({
//       success: true,
//       data: gig,
//       message: 'Gig created and payment captured successfully'
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error('PayPal capture & create gig error:', error);
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// /**********************
//  * Track share (click) — pay sharer from gig.availableFunds
//  * GET /api/track-share/:trackingToken
//  * Public endpoint — returns JSON (frontend will redirect/open gig link)
//  **********************/
// exports.trackShareClick = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { trackingToken } = req.params;

//     const share = await Share.findOne({ trackingToken })
//       .populate('gig')
//       .populate('user')
//       .session(session);

//     if (!share) {
//       await session.abortTransaction();
//       return res.status(404).json({ success: false, message: 'Invalid share link', gigLink: null });
//     }

//     const gig = share.gig;

//     if (!gig.isActive) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'This gig is no longer active', gigLink: gig.link });
//     }

//     // ✅ ENHANCED: Better unique visitor identification
//     const visitorIdentifier = [
//       req.ip,
//       req.get('User-Agent') || '',
//       req.get('Accept-Language') || '',
//       req.get('Accept-Encoding') || ''
//     ].join('|');
    
//     const visitorHash = crypto.createHash('md5').update(visitorIdentifier).digest('hex');
//     const isUniqueClick = !share.uniqueVisitors.includes(visitorHash);

//     // Update share stats
//     share.totalClicks = (share.totalClicks || 0) + 1;
//     if (isUniqueClick) {
//       share.uniqueClicks = (share.uniqueClicks || 0) + 1;
//       share.uniqueVisitors.push(visitorHash);
      
//       // ✅ FIX: Prevent array from growing too large (keep last 1000 unique visitors)
//       if (share.uniqueVisitors.length > 1000) {
//         share.uniqueVisitors = share.uniqueVisitors.slice(-1000);
//       }
//     }

//     await share.save({ session });

//     let earnedMoney = false;
//     let earningsAmount = 0;

//     // ✅ FIXED: Calculate payout from availableFunds, not budget
//     if (isUniqueClick && !share.isPaid && gig.sharesCompleted < gig.sharesRequired) {
//       const amountPerShare = parseFloat((gig.availableFunds / gig.sharesRequired).toFixed(2));
//       const userEarning = amountPerShare;

//       console.log(`💰 Share Payout Debug: Available=$${gig.availableFunds}, Shares=${gig.sharesRequired}, PerShare=$${amountPerShare}`);

//       if (gig.availableFunds >= userEarning && userEarning > 0) {
//         // Mark share as paid
//         share.amountEarned = userEarning;
//         share.isPaid = true;

//         // ✅ FIXED: Update sharer wallet with proper number formatting
//         const currentUser = await User.findById(share.user._id).session(session);
//         const currentBalance = parseFloat(currentUser.walletBalance?.toString()) || 0;
//         const newUserBalance = parseFloat((currentBalance + userEarning).toFixed(2));

//         await User.findByIdAndUpdate(
//           share.user._id,
//           { $set: { walletBalance: newUserBalance } },
//           { session }
//         );

//         // ✅ FIXED: Create transaction with proper number formatting
//         await Transaction.create([{
//           user: share.user._id,
//           gig: gig._id,
//           share: share._id,
//           type: 'credit',
//           amount: userEarning,
//           description: `Earnings from sharing gig: ${gig.title}`,
//           balanceAfter: newUserBalance,
//           metadata: {
//             platformFee: 0,
//             userEarning,
//             totalAmount: amountPerShare,
//             uniqueClick: true,
//             visitorHash: visitorHash // Store for audit
//           }
//         }], { session });

//         // Deduct from gig.availableFunds
//         gig.availableFunds = parseFloat((gig.availableFunds - userEarning).toFixed(2));
//         gig.sharesCompleted = (gig.sharesCompleted || 0) + 1;
//         gig.totalClicks = (gig.totalClicks || 0) + 1;

//         if (gig.sharesCompleted >= gig.sharesRequired) {
//           gig.isActive = false;
//           console.log(`🎯 Gig ${gig._id} completed all shares and is now inactive`);
//         }

//         await gig.save({ session });
//         await share.save({ session });

//         earnedMoney = true;
//         earningsAmount = userEarning;
        
//         console.log(`✅ Paid $${userEarning} to sharer. Remaining available: $${gig.availableFunds}`);
//       } else {
//         console.warn('❌ Not enough availableFunds:', {
//           gigId: gig._id,
//           available: gig.availableFunds,
//           needed: userEarning,
//           sharesCompleted: gig.sharesCompleted,
//           sharesRequired: gig.sharesRequired
//         });
//       }
//     }

//     await session.commitTransaction();

//     res.status(200).json({
//       success: true,
//       data: {
//         gigLink: gig.link,
//         gigTitle: gig.title,
//         tracked: true,
//         earnedMoney,
//         earningsAmount,
//         isUniqueClick,
//         gigActive: gig.isActive,
//         sharesCompleted: gig.sharesCompleted,
//         sharesRequired: gig.sharesRequired,
//         availableFunds: gig.availableFunds
//       },
//       message: earnedMoney ? `Earned $${earningsAmount.toFixed(2)} from this share!` : 'Share tracked successfully'
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     console.error('Track share error:', error);
//     res.status(500).json({ success: false, message: 'Error tracking share', gigLink: null });
//   } finally {
//     session.endSession();
//   }
// };
// /**********************
//  * Private endpoints (user's own)
//  **********************/
// exports.getMyGigs = async (req, res, next) => {
//   try {
//     const gigs = await Gig.find({ user: req.user.id })
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: gigs.length, data: gigs });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getMyShares = async (req, res, next) => {
//   try {
//     const shares = await Share.find({ user: req.user.id })
//       .populate('gig', 'title budget sharesRequired sharesCompleted isActive availableFunds')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: shares.length, data: shares });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.getShareByToken = async (req, res, next) => {
//   try {
//     const share = await Share.findOne({ trackingToken: req.params.trackingToken })
//       .populate('gig', 'title link budget sharesRequired sharesCompleted isActive')
//       .populate('user', 'name email');

//     if (!share) {
//       return res.status(404).json({ success: false, message: 'Share not found' });
//     }

//     if (share.user._id.toString() !== req.user.id) {
//       return res.status(403).json({ success: false, message: 'Access denied. You can only view your own shares.' });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         share: {
//           _id: share._id,
//           trackingToken: share.trackingToken,
//           totalClicks: share.totalClicks,
//           uniqueClicks: share.uniqueClicks,
//           amountEarned: share.amountEarned,
//           isPaid: share.isPaid,
//           createdAt: share.createdAt
//         },
//         gig: share.gig
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching share details:', error);
//     next(error);
//   }
// };

// /**********************
//  * Create gig using wallet (your existing route)
//  **********************/
// exports.createGigWithWallet = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { title, description, link, budget, sharesRequired } = req.body;

//     if (!budget || parseFloat(budget) < 15) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Minimum gig amount is $15' });
//     }

//     const user = await User.findById(req.user.id).session(session);

//     if (!user || user.walletBalance < budget) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
//     }

//     // Compute commission
//     const total = parseFloat(budget);
//     const { platformFee, availableFunds } = computeCommission(total);

//     // ✅ FIXED: Use correct fields that exist in Gig model
//     const gigArr = await Gig.create([{
//       title,
//       description,
//       link,
//       budget: total,
//       sharesRequired,
//       user: req.user.id,
//       isActive: true,
//       paymentStatus: 'completed',
//       platformFee,
//       availableFunds,
//       paymentMethod: 'wallet',
//       payerEmail: user.email || ''
//     }], { session });

//     const gig = gigArr[0];

//     // Deduct from user's wallet
//     const newBalance = parseFloat((user.walletBalance - total).toFixed(2));
//     await User.findByIdAndUpdate(req.user.id, { walletBalance: newBalance }, { session });

//     // Create transaction record for creator payment
//     await Transaction.create([{
//       user: req.user.id,
//       gig: gig._id,
//       type: 'debit',
//       amount: total,
//       description: `Payment for gig: ${title}`,
//       balanceAfter: newBalance,
//       metadata: {
//         paymentMethod: 'wallet',
//         platformFee
//       }
//     }], { session });

//     // Transfer commission to admin
//     const adminUser = await getAdminUser(session);
//     await User.findByIdAndUpdate(
//       adminUser._id,
//       { $inc: { walletBalance: platformFee } },
//       { session }
//     );

//     await Transaction.create([{
//       user: adminUser._id,
//       gig: gig._id,
//       type: 'credit',
//       amount: platformFee,
//       description: `Platform commission from gig: ${title}`,
//       balanceAfter: adminUser.walletBalance + platformFee,
//       metadata: {
//         paymentMethod: 'wallet',
//         commissionType: 'platform_fee',
//         gigBudget: total
//       }
//     }], { session });

//     console.log(`💰 Commission $${platformFee} transferred to admin wallet`);

//     await session.commitTransaction();

//     res.status(201).json({ success: true, data: gig, newBalance, message: 'Gig created using wallet balance' });
//   } catch (error) {
//     await session.abortTransaction();
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };

// /**********************
//  * Generate share URL for a gig
//  **********************/
// exports.generateShareUrl = async (req, res, next) => {
//   console.log("Generate share URL clicked");
  
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // Find the gig
//     const gig = await Gig.findById(id).session(session);
//     if (!gig) {
//       await session.abortTransaction();
//       return res.status(404).json({ success: false, message: 'Gig not found' });
//     }

//     // Check if gig is active
//     if (!gig.isActive) {
//       await session.abortTransaction();
//       return res.status(400).json({ success: false, message: 'Cannot share an inactive gig' });
//     }

//     // ✅ FIX: Check if user already has a share for this gig
//     const existingShare = await Share.findOne({ 
//       gig: gig._id, 
//       user: userId 
//     }).session(session);

//     if (existingShare) {
//       await session.commitTransaction();
      
//       // Return existing share URL instead of creating new one
//       const shareUrl = `${req.protocol}://${req.get('host')}/api/gigs/track-share/${existingShare.trackingToken}`;
      
//       return res.status(200).json({
//         success: true,
//         data: {
//           shareUrl,
//           trackingToken: existingShare.trackingToken,
//           shareId: existingShare._id,
//           gig: {
//             id: gig._id,
//             title: gig.title,
//             budget: gig.budget
//           },
//           existing: true // Flag to indicate this is an existing share
//         },
//         message: 'You already have a share link for this gig'
//       });
//     }

//     // Generate unique tracking token
//     const trackingToken = crypto.randomBytes(16).toString('hex');

//     // Create share record
//     const share = await Share.create([{
//       gig: gig._id,
//       user: userId,
//       trackingToken,
//       totalClicks: 0,
//       uniqueClicks: 0,
//       uniqueVisitors: [],
//       amountEarned: 0,
//       isPaid: false
//     }], { session });

//     await session.commitTransaction();

//     // Construct the shareable URL
//     const shareUrl = `${req.protocol}://${req.get('host')}/api/gigs/track-share/${trackingToken}`;

//     res.status(201).json({
//       success: true,
//       data: {
//         shareUrl,
//         trackingToken,
//         shareId: share[0]._id,
//         gig: {
//           id: gig._id,
//           title: gig.title,
//           budget: gig.budget
//         },
//         existing: false
//       },
//       message: 'Share URL generated successfully'
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     console.error('Generate share URL error:', error);
//     next(error);
//   } finally {
//     session.endSession();
//   }
// };


// controllers/gigs.js
const Gig = require('../models/Gig');
const Share = require('../models/Share');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const NotificationService = require('../utils/notificationService');

const { client: paypalClient, checkoutNodeJssdk } = require('../utils/paypalClient');

/**
 * Helper: enforce min gig amount and commission
 * Commission: 6.5% + $2
 */

const getAdminUser = async (session) => {
  let admin = await User.findOne({ role: 'admin' }).session(session);
  if (!admin) {
    const randomPassword = crypto.randomBytes(16).toString('hex');
    admin = await User.create([{
      name: 'Platform Admin',
      email: 'admin@gigshare.com',
      password: randomPassword,
      role: 'admin',
      walletBalance: 0
    }], { session });
    admin = admin[0];
    console.log('👑 Admin user created automatically');
  }
  return admin;
};

function computeCommission(totalAmount) {
  const platformFee = parseFloat((totalAmount * 0.065 + 2).toFixed(2));
  const availableFunds = parseFloat((totalAmount - platformFee).toFixed(2));
  
  console.log(`💰 Commission Debug: Total=$${totalAmount}, Fee=$${platformFee}, Available=$${availableFunds}`);
  
  return { platformFee, availableFunds };
}

/**********************
 * Public endpoints
 **********************/

exports.getGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ isActive: true })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: gigs.length, data: gigs });
  } catch (error) {
    next(error);
  }
};

exports.getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('user', 'name email');

    if (!gig) {
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    res.status(200).json({ success: true, data: gig });
  } catch (error) {
    next(error);
  }
};

/**********************
 * PayPal: create order
 * (frontend will call this to get an orderId)
 **********************/
exports.createPaypalOrder = async (req, res, next) => {
  try {
    const { budget } = req.body;

    if (!budget || parseFloat(budget) < 15) {
      return res.status(400).json({ success: false, message: 'Minimum gig amount is $15' });
    }

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: parseFloat(budget).toFixed(2)
          }
        }
      ]
    });

    const response = await paypalClient().execute(request);
    const orderId = response.result.id;

    res.status(200).json({ success: true, data: { orderId } });
  } catch (error) {
    console.error('PayPal create order error:', error);
    next(error);
  }
};

/**********************
 * PayPal: capture order and create gig atomically
 * body: { orderId, title, description, link, budget, sharesRequired, contentType, mediaFileName }
 **********************/
exports.capturePaypalOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      orderId, 
      title, 
      description, 
      link, 
      budget, 
      sharesRequired, 
      contentType = 'link', 
      mediaFileName = '' 
    } = req.body;

    if (!orderId) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Missing orderId' });
    }

    if (!budget || parseFloat(budget) < 15) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Minimum gig amount is $15' });
    }

    // Validate content type
    if (!['link', 'image', 'video'].includes(contentType)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    // Validate that link is provided for link type
    if (contentType === 'link' && (!link || !link.trim())) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Link is required for link type gigs' });
    }

    // Capture the order using PayPal SDK
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const captureResponse = await paypalClient().execute(request);
    const capture = captureResponse.result;

    const status = capture.status;
    if (status !== 'COMPLETED') {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    // Extract payer info
    const payer = capture.payer || {};
    const payerEmail = payer.email_address || (payer?.payer_id || '');

    // Compute commission
    const total = parseFloat(budget);
    const { platformFee, availableFunds } = computeCommission(total);

    // Create gig with content type fields
    const gigArr = await Gig.create([{
      title: (title || '').trim(),
      description: (description || '').trim(),
      link: (link || '').trim(),
      contentType: contentType,
      mediaFileName: mediaFileName || '',
      budget: total,
      sharesRequired: parseInt(sharesRequired, 10),
      user: req.user.id,
      isActive: true,
      platformFee,
      availableFunds,
      paymentStatus: 'completed',
      paymentMethod: 'paypal',
      paypalOrderId: orderId,
      payerEmail: payerEmail
    }], { session });

    const gig = gigArr[0];
       
    try {
      const creator = await User.findById(req.user.id);
      await NotificationService.notifyGigCreated(gig, creator);
    } catch (notifyError) {
      console.error('Failed to send gig creation notification:', notifyError);
      // Don't fail the transaction if notification fails
    }
    // Record transaction
    await Transaction.create([{
      user: req.user.id,
      gig: gig._id,
      type: 'debit',
      amount: total,
      description: `Payment for gig: ${gig.title}`,
      balanceAfter: undefined,
      metadata: {
        paymentMethod: 'paypal',
        paypalOrderId: orderId,
        platformFee,
        contentType: contentType
      }
    }], { session });

    // Transfer commission to admin
    const adminUser = await getAdminUser(session);
    await User.findByIdAndUpdate(
      adminUser._id,
      { $inc: { walletBalance: platformFee } },
      { session }
    );

    await Transaction.create([{
      user: adminUser._id,
      gig: gig._id,
      type: 'credit',
      amount: platformFee,
      description: `Platform commission from gig: ${gig.title}`,
      balanceAfter: adminUser.walletBalance + platformFee,
      metadata: {
        paymentMethod: 'paypal',
        commissionType: 'platform_fee',
        gigBudget: total,
        payerEmail: payerEmail,
        contentType: contentType
      }
    }], { session });

    console.log(`💰 Commission $${platformFee} transferred to admin wallet`);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: gig,
      message: 'Gig created and payment captured successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('PayPal capture & create gig error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

/**********************
 * Track share (click) - UPDATED FOR SCREENSHOT VERIFICATION
 * Now only tracks clicks, payment happens after approval
 **********************/
exports.trackShareClick = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { trackingToken } = req.params;

    const share = await Share.findOne({ trackingToken })
      .populate('gig')
      .populate('user')
      .session(session);

    if (!share) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Invalid share link', gigLink: null });
    }

    const gig = share.gig;

    if (!gig.isActive) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'This gig is no longer active', gigLink: gig.link });
    }

    // Enhanced visitor identification
    const visitorIdentifier = [
      req.ip,
      req.get('User-Agent') || '',
      req.get('Accept-Language') || '',
      req.get('Accept-Encoding') || ''
    ].join('|');
    
    const visitorHash = crypto.createHash('md5').update(visitorIdentifier).digest('hex');
    const isUniqueClick = !share.uniqueVisitors.includes(visitorHash);

    // Update share stats
    share.totalClicks = (share.totalClicks || 0) + 1;
    if (isUniqueClick) {
      share.uniqueClicks = (share.uniqueClicks || 0) + 1;
      share.uniqueVisitors.push(visitorHash);
      
      // Prevent array from growing too large
      if (share.uniqueVisitors.length > 1000) {
        share.uniqueVisitors = share.uniqueVisitors.slice(-1000);
      }
    }

    await share.save({ session });

    // Update gig stats
    gig.totalClicks = (gig.totalClicks || 0) + 1;
    if (gig.contentType === 'image' || gig.contentType === 'video') {
      gig.totalViews = (gig.totalViews || 0) + 1;
    }
    await gig.save({ session });

    await session.commitTransaction();

    // Return data without payment - payment happens after approval
    res.status(200).json({
      success: true,
      data: {
        gigLink: gig.link,
        gigTitle: gig.title,
        contentType: gig.contentType,
        tracked: true,
        earnedMoney: false, // No automatic payment
        earningsAmount: 0,
        isUniqueClick,
        gigActive: gig.isActive,
        sharesCompleted: gig.sharesCompleted,
        sharesRequired: gig.sharesRequired,
        availableFunds: gig.availableFunds,
        totalViews: gig.totalViews || 0,
        message: 'Click tracked. Submit screenshots to get paid.'
      },
      message: 'Share tracked successfully. Submit proof to get paid.'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Track share error:', error);
    res.status(500).json({ success: false, message: 'Error tracking share', gigLink: null });
  } finally {
    session.endSession();
  }
};

/**********************
 * NEW: Submit proof of sharing
 **********************/
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

/**********************
 * NEW: Approve submission (for gig owners)
 **********************/
// In controllers/gigs.js - fix the approveSubmission function
exports.approveSubmission = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { shareId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    // Find the share with gig populated
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

    // Calculate earnings
    const amountPerShare = gig.availableFunds / gig.sharesRequired;
    const userEarning = amountPerShare;

    // Check if funds are available
    if (gig.availableFunds < userEarning) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Insufficient funds in gig budget' });
    }

    // Update share status and process payment
    share.submissionStatus = 'approved';
    share.approvedAt = new Date();
    share.amountEarned = userEarning;
    share.isPaid = true;
    share.submissionProof[0].status = 'approved';
    share.submissionProof[0].verifiedAt = new Date();
    share.submissionProof[0].verifiedBy = userId;
    share.submissionProof[0].verificationNotes = notes || 'Approved by gig owner';

    // Update gig progress
    gig.sharesCompleted += 1;
    gig.availableFunds = parseFloat((gig.availableFunds - userEarning).toFixed(2));

    // Check if gig is completed
    if (gig.sharesCompleted >= gig.sharesRequired) {
      gig.isActive = false;
    }

    // Update sharer wallet
    const sharer = await User.findById(share.user).session(session);
    const currentBalance = parseFloat(sharer.walletBalance?.toString()) || 0;
    const newBalance = parseFloat((currentBalance + userEarning).toFixed(2));
    
    sharer.walletBalance = newBalance;
    await sharer.save({ session });

    await share.save({ session });
    await gig.save({ session });

    // ✅ FIXED: Use 'credit' instead of 'credit_pending'
    await Transaction.create([{
      user: share.user,
      gig: gig._id,
      share: share._id,
      type: 'credit', // ✅ CHANGED FROM 'credit_pending' to 'credit'
      amount: userEarning,
      description: `Earnings from sharing gig: ${gig.title}`,
      balanceAfter: newBalance,
      metadata: {
        submissionApproved: true,
        approvedBy: userId,
        approvedAt: new Date(),
        notes: notes,
        contentType: gig.contentType
      }
    }], { session });

    await session.commitTransaction();

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
    next(error);
  } finally {
    session.endSession();
  }
};
/**********************
 * NEW: Reject submission (for gig owners)
 **********************/
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

/**********************
 * NEW: Get submissions for a gig (for gig owners)
 **********************/
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

/**********************
 * Private endpoints (user's own)
 **********************/
exports.getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ user: req.user.id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: gigs.length, data: gigs });
  } catch (error) {
    next(error);
  }
};

exports.getMyShares = async (req, res, next) => {
  try {
    const shares = await Share.find({ user: req.user.id })
      .populate('gig', 'title budget sharesRequired sharesCompleted isActive availableFunds contentType mediaFileName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: shares.length, data: shares });
  } catch (error) {
    next(error);
  }
};

exports.getShareByToken = async (req, res, next) => {
  try {
    const share = await Share.findOne({ trackingToken: req.params.trackingToken })
      .populate('gig', 'title link budget sharesRequired sharesCompleted isActive contentType mediaFileName')
      .populate('user', 'name email');

    if (!share) {
      return res.status(404).json({ success: false, message: 'Share not found' });
    }

    if (share.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only view your own shares.' });
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
          submissionStatus: share.submissionStatus,
          submittedAt: share.submittedAt,
          approvedAt: share.approvedAt,
          submissionProof: share.submissionProof,
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

/**********************
 * Create gig using wallet (UPDATED for content types)
 **********************/
exports.createGigWithWallet = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      title, 
      description, 
      link, 
      budget, 
      sharesRequired, 
      contentType = 'link', 
      mediaFileName = '' 
    } = req.body;

    if (!budget || parseFloat(budget) < 15) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Minimum gig amount is $15' });
    }

    // Validate content type
    if (!['link', 'image', 'video'].includes(contentType)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Invalid content type' });
    }

    // Validate that link is provided for link type
    if (contentType === 'link' && (!link || !link.trim())) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Link is required for link type gigs' });
    }

    const user = await User.findById(req.user.id).session(session);

    if (!user || user.walletBalance < budget) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // Compute commission
    const total = parseFloat(budget);
    const { platformFee, availableFunds } = computeCommission(total);

    // Create gig with content type fields
    const gigArr = await Gig.create([{
      title,
      description,
      link,
      contentType: contentType,
      mediaFileName: mediaFileName || '',
      budget: total,
      sharesRequired,
      user: req.user.id,
      isActive: true,
      paymentStatus: 'completed',
      platformFee,
      availableFunds,
      paymentMethod: 'wallet',
      payerEmail: user.email || ''
    }], { session });

    const gig = gigArr[0];

  try {
      const creator = await User.findById(req.user.id);
      await NotificationService.notifyGigCreated(gig, creator);
    } catch (notifyError) {
      console.error('Failed to send gig creation notification:', notifyError);
      // Don't fail the transaction if notification fails
    }

    // Deduct from user's wallet
    const newBalance = parseFloat((user.walletBalance - total).toFixed(2));
    await User.findByIdAndUpdate(req.user.id, { walletBalance: newBalance }, { session });

    // Create transaction record for creator payment
    await Transaction.create([{
      user: req.user.id,
      gig: gig._id,
      type: 'debit',
      amount: total,
      description: `Payment for gig: ${title}`,
      balanceAfter: newBalance,
      metadata: {
        paymentMethod: 'wallet',
        platformFee,
        contentType: contentType
      }
    }], { session });

    // Transfer commission to admin
    const adminUser = await getAdminUser(session);
    await User.findByIdAndUpdate(
      adminUser._id,
      { $inc: { walletBalance: platformFee } },
      { session }
    );

    await Transaction.create([{
      user: adminUser._id,
      gig: gig._id,
      type: 'credit',
      amount: platformFee,
      description: `Platform commission from gig: ${title}`,
      balanceAfter: adminUser.walletBalance + platformFee,
      metadata: {
        paymentMethod: 'wallet',
        commissionType: 'platform_fee',
        gigBudget: total,
        contentType: contentType
      }
    }], { session });

    console.log(`💰 Commission $${platformFee} transferred to admin wallet`);

    await session.commitTransaction();

    res.status(201).json({ success: true, data: gig, newBalance, message: 'Gig created using wallet balance' });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**********************
 * Generate share URL for a gig
 **********************/
exports.generateShareUrl = async (req, res, next) => {
  console.log("Generate share URL clicked");
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the gig
    const gig = await Gig.findById(id).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Gig not found' });
    }

    // Check if gig is active
    if (!gig.isActive) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Cannot share an inactive gig' });
    }

    // Check if user already has a share for this gig
    const existingShare = await Share.findOne({ 
      gig: gig._id, 
      user: userId 
    }).session(session);

    if (existingShare) {
      await session.commitTransaction();
      
      // Return existing share URL
      const shareUrl = `${req.protocol}://${req.get('host')}/api/gigs/track-share/${existingShare.trackingToken}`;
      
      return res.status(200).json({
        success: true,
        data: {
          shareUrl,
          trackingToken: existingShare.trackingToken,
          shareId: existingShare._id,
          gig: {
            id: gig._id,
            title: gig.title,
            budget: gig.budget,
            contentType: gig.contentType
          },
          existing: true
        },
        message: 'You already have a share link for this gig'
      });
    }

    // Generate unique tracking token
    const trackingToken = crypto.randomBytes(16).toString('hex');

    // Create share record with submission status
    const share = await Share.create([{
      gig: gig._id,
      user: userId,
      trackingToken,
      totalClicks: 0,
      uniqueClicks: 0,
      uniqueVisitors: [],
      amountEarned: 0,
      isPaid: false,
      submissionStatus: 'pending' // NEW: Initialize submission status
    }], { session });

    await session.commitTransaction();

 try {
      const User = require('../models/User');
      const user = await User.findById(userId);
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Share Link Created',
        message: `Your share link for "${gig.title}" is ready! Share it to start earning.`,
        data: {
          gigId: gig._id,
          metadata: {
            gigTitle: gig.title,
            budget: gig.budget
          }
        },
        priority: 'low'
      });
    } catch (notifyError) {
      console.error('Failed to send share creation notification:', notifyError);
    }


    // Construct the shareable URL
    const shareUrl = `${req.protocol}://${req.get('host')}/api/gigs/track-share/${trackingToken}`;

    res.status(201).json({
      success: true,
      data: {
        shareUrl,
        trackingToken,
        shareId: share[0]._id,
        gig: {
          id: gig._id,
          title: gig.title,
          budget: gig.budget,
          contentType: gig.contentType
        },
        existing: false
      },
      message: 'Share URL generated successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Generate share URL error:', error);
    next(error);
  } finally {
    session.endSession();
  }
};

/**********************
 * Serve media files securely
 **********************/
exports.serveMedia = async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    // Security check
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ success: false, message: 'Invalid filename' });
    }

    // Find gig that contains this media file
    const gig = await Gig.findOne({ 
      mediaFileName: filename,
      contentType: { $in: ['image', 'video'] }
    });

    if (!gig) {
      return res.status(404).json({ success: false, message: 'Media file not found' });
    }

    // Check if gig is active
    if (!gig.isActive) {
      return res.status(403).json({ success: false, message: 'This gig is no longer active' });
    }

    // Construct file path
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Media file not found on server' });
    }

    // Set appropriate content type
    const mimeType = gig.contentType === 'image' ? 'image/jpeg' : 'video/mp4';
    res.setHeader('Content-Type', mimeType);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Serve media error:', error);
    res.status(500).json({ success: false, message: 'Error serving media file' });
  }
};