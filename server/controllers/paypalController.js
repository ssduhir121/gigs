
// const { client, checkoutNodeJssdk: paypal } = require('../utils/paypalClient');
// const Gig = require('../models/Gig');
// const Transaction = require('../models/Transaction');
// const User = require('../models/User');
// const NotificationService = require('../utils/notificationService');

// // 1️⃣ Create PayPal Order
// const createPaypalOrder = async (req, res, next) => {
//   console.log('📦 Creating PayPal order with data:', req.body)
//   try {
//     const { budget } = req.body;

//     if (!budget || parseFloat(budget) < 15) {
//       return res.status(400).json({
//         success: false,
//         message: 'Minimum gig amount is $15.',
//       });
//     }

//     // ✅ FIXED: Use proper decimal handling at EVERY step
//     const budgetAmount = parseFloat(budget);
    
//     // Calculate each component separately with proper rounding
//     const percentageFee = Math.round(budgetAmount * 0.065 * 100) / 100; // 6.5% rounded to 2 decimals
//     const fixedFee = 0.60;
//     const commission = Math.round((percentageFee + fixedFee) * 100) / 100; // Round commission
//     const totalAmount = Math.round((budgetAmount + commission) * 100) / 100; // Round total

//     console.log('💰 Commission calculation:', {
//       budget: budgetAmount,
//       percentageFee,
//       fixedFee,
//       commission,
//       totalAmount,
//       breakdown: {
//         percentage_fee: percentageFee.toFixed(2),
//         fixed_fee: fixedFee.toFixed(2),
//         total_commission: commission.toFixed(2),
//         item_total: budgetAmount.toFixed(2),
//         handling: commission.toFixed(2),
//         total_amount: totalAmount.toFixed(2)
//       }
//     });

//     // ✅ VERIFY: item_total + handling MUST equal total amount
//     const calculatedTotal = parseFloat((budgetAmount + commission).toFixed(2));
//     if (Math.abs(totalAmount - calculatedTotal) > 0.01) {
//       console.error('❌ Amount mismatch detected:', {
//         totalAmount,
//         calculatedTotal,
//         difference: totalAmount - calculatedTotal
//       });
//       throw new Error('Amount calculation error');
//     }

//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer('return=representation');
//     request.requestBody({
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             currency_code: 'USD',
//             value: totalAmount.toFixed(2), // Ensure exactly 2 decimal places
//             breakdown: {
//               item_total: { 
//                 currency_code: 'USD', 
//                 value: budgetAmount.toFixed(2) // Ensure exactly 2 decimal places
//               },
//               handling: { 
//                 currency_code: 'USD', 
//                 value: commission.toFixed(2) // Ensure exactly 2 decimal places
//               },
//             },
//           },
//           description: `Gig creation - $${budgetAmount.toFixed(2)}`,
//         },
//       ],
//       application_context: {
//         brand_name: "GigShare Platform",
//         landing_page: "LOGIN",
//         user_action: "PAY_NOW",
//         return_url: `${process.env.CLIENT_URL}/payment-success`,
//         cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
//       },
//     });

//     console.log('🔄 Sending PayPal create order request...');
//     console.log('📋 Request breakdown:', {
//       item_total: budgetAmount.toFixed(2),
//       handling: commission.toFixed(2),
//       total: totalAmount.toFixed(2),
//       sum: (parseFloat(budgetAmount.toFixed(2)) + parseFloat(commission.toFixed(2))).toFixed(2)
//     });

//     const order = await client().execute(request);
//     console.log('✅ PayPal order created successfully:', {
//       orderId: order.result.id,
//       status: order.result.status
//     });

//     res.status(200).json({
//       success: true,
//       data: {
//         orderId: order.result.id,
//         totalAmount: totalAmount.toFixed(2),
//       },
//     });
//   } catch (error) {
//     console.error('❌ PayPal create order error:', error.message || error);
//     console.error('Error details:', error);
//     next(error);
//   }
// };

// // 2️⃣ Capture Order & Create Gig - UPDATED FOR CONTENT TYPES
// const capturePaypalOrder = async (req, res, next) => {
//   console.log('🎯 Capture PayPal order request:', {
//     body: req.body,
//     user: req.user?.id
//   });

//   try {
//     const { 
//       orderId, 
//       title, 
//       description, 
//       link, 
//       budget, 
//       sharesRequired, 
//       contentType = 'link', 
//       mediaFileName = '' 
//     } = req.body;

//     if (!orderId) {
//       console.log('❌ Missing order ID');
//       return res.status(400).json({ success: false, message: 'Missing order ID' });
//     }

//     // ✅ ADDED: Validate content type
//     if (!['link', 'image', 'video'].includes(contentType)) {
//       return res.status(400).json({ success: false, message: 'Invalid content type' });
//     }

//     // ✅ ADDED: Validate that link is provided for link type
//     if (contentType === 'link' && (!link || !link.trim())) {
//       return res.status(400).json({ success: false, message: 'Link is required for link type gigs' });
//     }

//     // ✅ Check if gig already exists for this order
//     console.log('🔍 Checking for existing gig with orderId:', orderId);
//     const existingGig = await Gig.findOne({ 
//       'paypalTransaction.orderId': orderId 
//     });

//     if (existingGig) {
//       console.log('⚠️ Gig already exists for this order:', existingGig._id);
//       return res.status(200).json({
//         success: false,
//         message: 'Gig was already created',
//         data: existingGig
//       });
//     }

//     // ✅ Use OrdersGetRequest to verify payment status
//     console.log('🔄 Getting PayPal order details for:', orderId);
//     const request = new paypal.orders.OrdersGetRequest(orderId);
//     const orderDetails = await client().execute(request);
    
//     const captureData = orderDetails.result?.purchase_units?.[0]?.payments?.captures?.[0];
    
//     if (!captureData) {
//       console.log('❌ No capture data found.');
//       return res.status(400).json({
//         success: false,
//         message: 'Payment capture data not found',
//       });
//     }
    
//     if (captureData.status !== 'COMPLETED') {
//       console.log('❌ Payment not completed. Status:', captureData.status);
//       return res.status(400).json({
//         success: false,
//         message: `Payment not completed. Status: ${captureData.status}`,
//       });
//     }

//     console.log('✅ Payment verified successfully');

//     // ✅ Create gig with payment details
//     const payer = orderDetails.result?.payer;
    
//     // ✅ FIXED: Consistent commission structure - 6.5% + $0.60 (NOT $2)
//     const percentageFee = parseFloat((parseFloat(budget) * 0.065).toFixed(2));
//     const fixedFee = 0.60;
//     const commission = parseFloat((percentageFee + fixedFee).toFixed(2));
//     const availableFunds = parseFloat((parseFloat(budget) - commission).toFixed(2));

//     console.log('📊 Creating gig with details:', {
//       title,
//       budget,
//       contentType, // ✅ ADDED: Log content type
//       mediaFileName, // ✅ ADDED: Log media file name
//       percentageFee,
//       fixedFee,
//       commission,
//       availableFunds,
//       sharesRequired,
//       payerEmail: payer?.email_address,
//       commission_breakdown: {
//         percentage: '6.5%',
//         fixed_fee: '$0.60',
//         total_admin_fee: `$${commission.toFixed(2)}`
//       }
//     });

//     // ✅ UPDATED: Include content type fields in gig creation
//     const newGig = await Gig.create({
//       user: req.user.id,
//       title: title.trim(),
//       description: description.trim(),
//       link: link.trim(),
//       contentType: contentType,
//       mediaFileName: mediaFileName || '',
//       budget: parseFloat(budget),
//       sharesRequired: parseInt(sharesRequired, 10),
//       isActive: true,
//       platformFee: commission,
//       availableFunds,
//       paymentStatus: 'completed',
//       paypalTransaction: {
//         orderId,
//         payerEmail: payer?.email_address,
//         payerId: payer?.payer_id,
//         amount: parseFloat(budget),
//         status: captureData.status,
//         captureId: captureData.id,
//       },
//     });

//     console.log('✅ Gig created successfully:', newGig._id);

//     // ✅ UPDATED: Include content type in transaction metadata
//     await Transaction.create({
//       user: req.user.id,
//       gig: newGig._id,
//       type: 'debit',
//       amount: parseFloat(budget),
//       description: `Payment for gig: ${title}`,
//       metadata: {
//         paymentMethod: 'paypal',
//         paypalOrderId: orderId,
//         paypalCaptureId: captureData.id,
//         platformFee: commission,
//         captureStatus: captureData.status,
//         contentType: contentType, // ✅ ADDED: Track content type
//         mediaFileName: mediaFileName || '' // ✅ ADDED: Track media file name
//       },
//     });

//     // ✅ CREDIT TRANSACTION: Admin receives platform fees
//     const adminUser = await User.findOne({ role: 'admin' });
    
//     if (adminUser) {
//       // ✅ FIX: Convert current balance to number and ensure proper decimal format
//       const currentBalance = parseFloat(adminUser.walletBalance.toString()) || 0;
//       const newBalance = parseFloat((currentBalance + commission).toFixed(2));
      
//       console.log('💰 Updating admin wallet:', {
//         adminId: adminUser._id,
//         currentBalance,
//         commission,
//         newBalance
//       });

//       // ✅ FIX: Use parseFloat to ensure proper number format
//       adminUser.walletBalance = newBalance;
//       await adminUser.save();

//       // ✅ UPDATED: Include content type in admin transaction
//       await Transaction.create({
//         user: adminUser._id,
//         gig: newGig._id,
//         type: 'credit',
//         amount: commission,
//         description: `Platform fee from gig: ${title}`,
//         metadata: {
//           paymentMethod: 'paypal',
//           paypalOrderId: orderId,
//           sourceUser: req.user.id,
//           sourceGig: newGig._id,
//           contentType: contentType, // ✅ ADDED: Track content type
//           feeBreakdown: {
//             percentage: '6.5%',
//             fixed_fee: '0.60',
//             total: commission
//           }
//         },
//       });

//       console.log('✅ Admin fee collected successfully');
//     } else {
//       console.log('⚠️ No admin user found to credit platform fees');
//     }

//     // 🔔 NOTIFICATION: Payment Received Successfully
//     try {
//       await NotificationService.createNotification({
//         userId: req.user.id,
//         type: 'payment_received',
//         title: 'Payment Successful',
//         message: `Your payment of $${parseFloat(budget).toFixed(2)} for gig "${title}" has been processed successfully.`,
//         data: {
//           gigId: newGig._id,
//           amount: parseFloat(budget),
//           orderId: orderId,
//           metadata: {
//             gigTitle: title,
//             amount: parseFloat(budget).toFixed(2),
//             contentType: contentType,
//             sharesRequired: sharesRequired,
//             paymentMethod: 'paypal'
//           }
//         },
//         priority: 'high'
//       });
//     } catch (notifyError) {
//       console.error('Payment success notification failed:', notifyError);
//     }

//     // 🔔 NOTIFICATION: Gig Created Successfully
//     try {
//       const creator = await User.findById(req.user.id);
//       await NotificationService.notifyGigCreated(newGig, creator);
//     } catch (notifyError) {
//       console.error('Gig creation notification failed:', notifyError);
//     }

//     // 🔔 NOTIFICATION: Admin Notification for New Gig Payment
//     try {
//       const adminUsers = await User.find({ role: 'admin' });
//       for (const admin of adminUsers) {
//         await NotificationService.createNotification({
//           userId: admin._id,
//           type: 'payment_received',
//           title: 'New Gig Payment Received',
//           message: `User ${req.user.name} created a new gig "${title}" with $${parseFloat(budget).toFixed(2)} payment. Platform fee: $${commission.toFixed(2)}`,
//           data: {
//             gigId: newGig._id,
//             creatorId: req.user.id,
//             amount: parseFloat(budget),
//             platformFee: commission,
//             orderId: orderId,
//             metadata: {
//               gigTitle: title,
//               creatorName: req.user.name,
//               contentType: contentType,
//               platformFee: commission.toFixed(2)
//             }
//           },
//           priority: 'medium'
//         });
//       }
//     } catch (notifyError) {
//       console.error('Admin payment notification failed:', notifyError);
//     }

//     console.log('✅ Transaction recorded for gig:', newGig._id);

//     res.status(201).json({
//       success: true,
//       message: 'Gig created successfully',
//       data: newGig,
//     });

//   } catch (error) {
//     console.error('❌ PayPal capture error:', error.message);
//     console.error('Error stack:', error.stack);

//     // 🔔 NOTIFICATION: Payment Failed
//     try {
//       await NotificationService.createNotification({
//         userId: req.user.id,
//         type: 'system_announcement',
//         title: 'Payment Processing Failed',
//         message: `Your payment for gig creation failed. Please try again or contact support. Error: ${error.message}`,
//         data: {
//           orderId: req.body.orderId,
//           error: error.message,
//           metadata: {
//             failedAt: new Date(),
//             errorType: 'payment_capture_failed'
//           }
//         },
//         priority: 'high'
//       });
//     } catch (notifyError) {
//       console.error('Payment failure notification failed:', notifyError);
//     }
    
//     if (error.statusCode === 422) {
//       const issue = error.details?.[0]?.issue;
//       if (issue === 'ORDER_ALREADY_CAPTURED') {
//         return res.status(400).json({
//           success: false,
//           message: 'This payment was already processed. Check your gigs list.',
//         });
//       }
//     }
    
//     if (error.statusCode === 404) {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment order not found. Please try again.',
//       });
//     }
    
//     next(error);
//   }
// };

// module.exports = {
//   createPaypalOrder,
//   capturePaypalOrder,
// };

const { client, checkoutNodeJssdk: paypal } = require('../utils/paypalClient');
const Gig = require('../models/Gig');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const NotificationService = require('../utils/notificationService');

// 1️⃣ Create PayPal Order
const createPaypalOrder = async (req, res, next) => {
  console.log('📦 Creating PayPal order with data:', req.body)
  try {
    const { budget } = req.body;

    if (!budget || parseFloat(budget) < 15) {
      return res.status(400).json({
        success: false,
        message: 'Minimum gig amount is $15.',
      });
    }

    // ✅ FIXED: Use proper decimal handling at EVERY step
    const budgetAmount = parseFloat(budget);
    
    // Calculate each component separately with proper rounding
    const percentageFee = Math.round(budgetAmount * 0.065 * 100) / 100; // 6.5% rounded to 2 decimals
    const fixedFee = 0.60;
    const commission = Math.round((percentageFee + fixedFee) * 100) / 100; // Round commission
    const totalAmount = Math.round((budgetAmount + commission) * 100) / 100; // Round total

    console.log('💰 Commission calculation:', {
      budget: budgetAmount,
      percentageFee,
      fixedFee,
      commission,
      totalAmount,
      breakdown: {
        percentage_fee: percentageFee.toFixed(2),
        fixed_fee: fixedFee.toFixed(2),
        total_commission: commission.toFixed(2),
        item_total: budgetAmount.toFixed(2),
        handling: commission.toFixed(2),
        total_amount: totalAmount.toFixed(2)
      }
    });

    // ✅ VERIFY: item_total + handling MUST equal total amount
    const calculatedTotal = parseFloat((budgetAmount + commission).toFixed(2));
    if (Math.abs(totalAmount - calculatedTotal) > 0.01) {
      console.error('❌ Amount mismatch detected:', {
        totalAmount,
        calculatedTotal,
        difference: totalAmount - calculatedTotal
      });
      throw new Error('Amount calculation error');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount.toFixed(2), // Ensure exactly 2 decimal places
            breakdown: {
              item_total: { 
                currency_code: 'USD', 
                value: budgetAmount.toFixed(2) // Ensure exactly 2 decimal places
              },
              handling: { 
                currency_code: 'USD', 
                value: commission.toFixed(2) // Ensure exactly 2 decimal places
              },
            },
          },
          description: `Gig creation - $${budgetAmount.toFixed(2)}`,
        },
      ],
      application_context: {
        brand_name: "GigShare Platform",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
    });

    console.log('🔄 Sending PayPal create order request...');
    console.log('📋 Request breakdown:', {
      item_total: budgetAmount.toFixed(2),
      handling: commission.toFixed(2),
      total: totalAmount.toFixed(2),
      sum: (parseFloat(budgetAmount.toFixed(2)) + parseFloat(commission.toFixed(2))).toFixed(2)
    });

    const order = await client().execute(request);
    console.log('✅ PayPal order created successfully:', {
      orderId: order.result.id,
      status: order.result.status
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.result.id,
        totalAmount: totalAmount.toFixed(2),
      },
    });
  } catch (error) {
    console.error('❌ PayPal create order error:', error.message || error);
    console.error('Error details:', error);
    next(error);
  }
};

// 2️⃣ Capture Order & Create Gig
const capturePaypalOrder = async (req, res, next) => {
  console.log('🎯 Capture PayPal order request:', {
    body: req.body,
    user: req.user?.id
  });

  try {
    const { 
      orderId, 
      title, 
      description, 
      link, 
      budget, 
      sharesRequired, 
      mediaFile,           // ← URL from upload
      mediaFileName = '',
      shareType = 'public' 
    } = req.body;

    if (!orderId) {
      console.log('❌ Missing order ID');
      return res.status(400).json({ success: false, message: 'Missing order ID' });
    }

    // ✅ FIXED: Improved content type detection with better logging
    let contentType = 'link';
    if (mediaFile && mediaFileName) {
      // Extract file extension properly
      const fileExt = mediaFileName.toLowerCase().includes('.') 
        ? mediaFileName.toLowerCase().substring(mediaFileName.lastIndexOf('.'))
        : '';

      console.log('🔍 File extension analysis:', {
        mediaFileName,
        fileExt,
        hasDot: mediaFileName.includes('.'),
        lastDotIndex: mediaFileName.lastIndexOf('.')
      });

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
      
      if (imageExtensions.includes(fileExt)) {
        contentType = 'image';
      } else if (videoExtensions.includes(fileExt)) {
        contentType = 'video';
      } else {
        // If we have a media file but can't determine type, default to image
        contentType = mediaFile ? 'image' : 'link';
      }
    }

    console.log('✅ Final content type determination:', {
      mediaFile: !!mediaFile,
      mediaFileName,
      contentType
    });

    // ✅ UPDATED: Validate that link is provided for link type gigs
    if (contentType === 'link' && (!link || !link.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Link is required for link type gigs' 
      });
    }

    // ✅ UPDATED: Validate that media file is provided for media type gigs
    if ((contentType === 'image' || contentType === 'video') && !mediaFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Media file URL is required for image/video gigs' 
      });
    }

    // ✅ Check if gig already exists for this order
    console.log('🔍 Checking for existing gig with orderId:', orderId);
    const existingGig = await Gig.findOne({ 
      'paypalTransaction.orderId': orderId 
    });

    if (existingGig) {
      console.log('⚠️ Gig already exists for this order:', existingGig._id);
      return res.status(200).json({
        success: false,
        message: 'Gig was already created',
        data: existingGig
      });
    }

    // ✅ Use OrdersGetRequest to verify payment status
    console.log('🔄 Getting PayPal order details for:', orderId);
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const orderDetails = await client().execute(request);
    
    const captureData = orderDetails.result?.purchase_units?.[0]?.payments?.captures?.[0];
    
    if (!captureData) {
      console.log('❌ No capture data found.');
      return res.status(400).json({
        success: false,
        message: 'Payment capture data not found',
      });
    }
    
    if (captureData.status !== 'COMPLETED') {
      console.log('❌ Payment not completed. Status:', captureData.status);
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${captureData.status}`,
      });
    }

    console.log('✅ Payment verified successfully');

    // ✅ Create gig with payment details
    const payer = orderDetails.result?.payer;
    
    // ✅ FIXED: Consistent commission structure - 6.5% + $0.60
    const percentageFee = parseFloat((parseFloat(budget) * 0.065).toFixed(2));
    const fixedFee = 0.60;
    const commission = parseFloat((percentageFee + fixedFee).toFixed(2));
    const availableFunds = parseFloat((parseFloat(budget) - commission).toFixed(2));

    console.log('📊 Creating gig with details:', {
      title,
      budget,
      contentType,
      mediaFileName,
      shareType,
      percentageFee,
      fixedFee,
      commission,
      availableFunds,
      sharesRequired,
      payerEmail: payer?.email_address,
      commission_breakdown: {
        percentage: '6.5%',
        fixed_fee: '$0.60',
        total_admin_fee: `$${commission.toFixed(2)}`
      }
    });

    // ✅ UPDATED: Include ALL fields in gig creation
    const newGig = await Gig.create({
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      contentType: contentType,
      mediaFile: mediaFile || '',        // ← Store the actual file URL
      mediaFileName: mediaFileName || '',
      shareType: shareType,
      budget: parseFloat(budget),
      sharesRequired: parseInt(sharesRequired, 10),
      isActive: true,
      platformFee: commission,
      availableFunds,
      paymentStatus: 'completed',
      paypalTransaction: {
        orderId,
        payerEmail: payer?.email_address,
        payerId: payer?.payer_id,
        amount: parseFloat(budget),
        status: captureData.status,
        captureId: captureData.id,
      },
    });

    console.log('✅ Gig created successfully:', newGig._id);

    // ✅ UPDATED: Include all fields in transaction metadata
    await Transaction.create({
      user: req.user.id,
      gig: newGig._id,
      type: 'debit',
      amount: parseFloat(budget),
      description: `Payment for gig: ${title}`,
      metadata: {
        paymentMethod: 'paypal',
        paypalOrderId: orderId,
        paypalCaptureId: captureData.id,
        platformFee: commission,
        captureStatus: captureData.status,
        contentType: contentType,
        mediaFileName: mediaFileName || '',
        shareType: shareType
      },
    });

    // ✅ CREDIT TRANSACTION: Admin receives platform fees
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
      // ✅ FIX: Convert current balance to number and ensure proper decimal format
      const currentBalance = parseFloat(adminUser.walletBalance.toString()) || 0;
      const newBalance = parseFloat((currentBalance + commission).toFixed(2));
      
      console.log('💰 Updating admin wallet:', {
        adminId: adminUser._id,
        currentBalance,
        commission,
        newBalance
      });

      // ✅ FIX: Use parseFloat to ensure proper number format
      adminUser.walletBalance = newBalance;
      await adminUser.save();

      // ✅ UPDATED: Include all fields in admin transaction
      await Transaction.create({
        user: adminUser._id,
        gig: newGig._id,
        type: 'credit',
        amount: commission,
        description: `Platform fee from gig: ${title}`,
        metadata: {
          paymentMethod: 'paypal',
          paypalOrderId: orderId,
          sourceUser: req.user.id,
          sourceGig: newGig._id,
          contentType: contentType,
          shareType: shareType,
          feeBreakdown: {
            percentage: '6.5%',
            fixed_fee: '0.60',
            total: commission
          }
        },
      });

      console.log('✅ Admin fee collected successfully');
    } else {
      console.log('⚠️ No admin user found to credit platform fees');
    }

    // 🔔 NOTIFICATION: Payment Received Successfully
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'payment_received',
        title: 'Payment Successful',
        message: `Your payment of $${parseFloat(budget).toFixed(2)} for gig "${title}" has been processed successfully.`,
        data: {
          gigId: newGig._id,
          amount: parseFloat(budget),
          orderId: orderId,
          metadata: {
            gigTitle: title,
            amount: parseFloat(budget).toFixed(2),
            contentType: contentType,
            sharesRequired: sharesRequired,
            paymentMethod: 'paypal'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Payment success notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Gig Created Successfully
    try {
      const creator = await User.findById(req.user.id);
      await NotificationService.notifyGigCreated(newGig, creator);
    } catch (notifyError) {
      console.error('Gig creation notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Admin Notification for New Gig Payment
    try {
      const adminUsers = await User.find({ role: 'admin' });
      for (const admin of adminUsers) {
        await NotificationService.createNotification({
          userId: admin._id,
          type: 'payment_received',
          title: 'New Gig Payment Received',
          message: `User ${req.user.name} created a new gig "${title}" with $${parseFloat(budget).toFixed(2)} payment. Platform fee: $${commission.toFixed(2)}`,
          data: {
            gigId: newGig._id,
            creatorId: req.user.id,
            amount: parseFloat(budget),
            platformFee: commission,
            orderId: orderId,
            metadata: {
              gigTitle: title,
              creatorName: req.user.name,
              contentType: contentType,
              platformFee: commission.toFixed(2)
            }
          },
          priority: 'medium'
        });
      }
    } catch (notifyError) {
      console.error('Admin payment notification failed:', notifyError);
    }

    console.log('✅ Transaction recorded for gig:', newGig._id);

    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      data: newGig,
    });

  } catch (error) {
    console.error('❌ PayPal capture error:', error.message);
    console.error('Error stack:', error.stack);

    // 🔔 NOTIFICATION: Payment Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Payment Processing Failed',
        message: `Your payment for gig creation failed. Please try again or contact support. Error: ${error.message}`,
        data: {
          orderId: req.body.orderId,
          error: error.message,
          metadata: {
            failedAt: new Date(),
            errorType: 'payment_capture_failed'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Payment failure notification failed:', notifyError);
    }
    
    if (error.statusCode === 422) {
      const issue = error.details?.[0]?.issue;
      if (issue === 'ORDER_ALREADY_CAPTURED') {
        return res.status(400).json({
          success: false,
          message: 'This payment was already processed. Check your gigs list.',
        });
      }
    }
    
    if (error.statusCode === 404) {
      return res.status(400).json({
        success: false,
        message: 'Payment order not found. Please try again.',
      });
    }
    
    next(error);
  }
};

// 3️⃣ Create Gig with Wallet Balance
const createGigWithWallet = async (req, res, next) => {
  console.log('💰 Creating gig with wallet balance:', {
    body: req.body,
    user: req.user?.id
  });

  try {
    const { 
      title, 
      description, 
      link, 
      budget, 
      sharesRequired, 
      mediaFile,           // ← URL from upload
      mediaFileName = '',
      shareType = 'public' 
    } = req.body;

    // ✅ Validate required fields
    if (!title || !description || !link || !budget || !sharesRequired) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (parseFloat(budget) < 15) {
      return res.status(400).json({
        success: false,
        message: 'Minimum gig amount is $15.'
      });
    }

    // ✅ Check user wallet balance
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const budgetAmount = parseFloat(budget);
    const userBalance = parseFloat(user.walletBalance.toString());

    if (userBalance < budgetAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Required: $${budgetAmount.toFixed(2)}, Available: $${userBalance.toFixed(2)}`
      });
    }

    // ✅ FIXED: Improved content type detection
    let contentType = 'link';
    if (mediaFile && mediaFileName) {
      // Extract file extension properly
      const fileExt = mediaFileName.toLowerCase().includes('.') 
        ? mediaFileName.toLowerCase().substring(mediaFileName.lastIndexOf('.'))
        : '';

      console.log('🔍 File extension analysis:', {
        mediaFileName,
        fileExt,
        hasDot: mediaFileName.includes('.'),
        lastDotIndex: mediaFileName.lastIndexOf('.')
      });

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];
      
      if (imageExtensions.includes(fileExt)) {
        contentType = 'image';
      } else if (videoExtensions.includes(fileExt)) {
        contentType = 'video';
      } else {
        // If we have a media file but can't determine type, default to image
        contentType = mediaFile ? 'image' : 'link';
      }
    }

    console.log('✅ Final content type determination:', {
      mediaFile: !!mediaFile,
      mediaFileName,
      contentType
    });

    // ✅ Validate content requirements
    if (contentType === 'link' && (!link || !link.trim())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Link is required for link type gigs' 
      });
    }

    if ((contentType === 'image' || contentType === 'video') && !mediaFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Media file URL is required for image/video gigs' 
      });
    }

    // ✅ Calculate commission (6.5% + $0.60)
    const percentageFee = parseFloat((budgetAmount * 0.065).toFixed(2));
    const fixedFee = 0.60;
    const commission = parseFloat((percentageFee + fixedFee).toFixed(2));
    const availableFunds = parseFloat((budgetAmount - commission).toFixed(2));

    console.log('📊 Creating wallet gig with details:', {
      title,
      budget: budgetAmount,
      contentType,
      mediaFileName,
      shareType,
      userBalance: userBalance,
      commission,
      availableFunds,
      sharesRequired
    });

    // ✅ Deduct from user's wallet
    user.walletBalance = parseFloat((userBalance - budgetAmount).toFixed(2));
    await user.save();

    console.log('✅ User wallet updated:', {
      previousBalance: userBalance,
      deducted: budgetAmount,
      newBalance: user.walletBalance
    });

    // ✅ Create gig with all fields
    const newGig = await Gig.create({
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      contentType: contentType,
      mediaFile: mediaFile || '',        // ← Store the actual file URL
      mediaFileName: mediaFileName || '',
      shareType: shareType,
      budget: budgetAmount,
      sharesRequired: parseInt(sharesRequired, 10),
      isActive: true,
      platformFee: commission,
      availableFunds,
      paymentStatus: 'completed',
      paymentMethod: 'wallet'
    });

    console.log('✅ Wallet gig created successfully:', newGig._id);

    // ✅ Record user transaction (debit)
    await Transaction.create({
      user: req.user.id,
      gig: newGig._id,
      type: 'debit',
      amount: budgetAmount,
      description: `Payment for gig: ${title}`,
      metadata: {
        paymentMethod: 'wallet',
        platformFee: commission,
        contentType: contentType,
        mediaFileName: mediaFileName || '',
        shareType: shareType
      },
    });

    // ✅ Credit admin with platform fees
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (adminUser) {
      const adminCurrentBalance = parseFloat(adminUser.walletBalance.toString()) || 0;
      const adminNewBalance = parseFloat((adminCurrentBalance + commission).toFixed(2));
      
      adminUser.walletBalance = adminNewBalance;
      await adminUser.save();

      await Transaction.create({
        user: adminUser._id,
        gig: newGig._id,
        type: 'credit',
        amount: commission,
        description: `Platform fee from gig: ${title}`,
        metadata: {
          paymentMethod: 'wallet',
          sourceUser: req.user.id,
          sourceGig: newGig._id,
          contentType: contentType,
          shareType: shareType,
          feeBreakdown: {
            percentage: '6.5%',
            fixed_fee: '0.60',
            total: commission
          }
        },
      });

      console.log('✅ Admin fee collected from wallet payment');
    }

    // 🔔 NOTIFICATION: Wallet Payment Successful
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'payment_received',
        title: 'Wallet Payment Successful',
        message: `Your gig "${title}" has been created using wallet balance. $${budgetAmount.toFixed(2)} deducted from your wallet.`,
        data: {
          gigId: newGig._id,
          amount: budgetAmount,
          paymentMethod: 'wallet',
          metadata: {
            gigTitle: title,
            amount: budgetAmount.toFixed(2),
            contentType: contentType,
            sharesRequired: sharesRequired,
            newBalance: user.walletBalance
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Wallet payment notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: Gig Created Successfully
    try {
      await NotificationService.notifyGigCreated(newGig, user);
    } catch (notifyError) {
      console.error('Gig creation notification failed:', notifyError);
    }

    res.status(201).json({
      success: true,
      message: 'Gig created successfully using wallet balance',
      data: newGig,
    });

  } catch (error) {
    console.error('❌ Wallet gig creation error:', error.message);
    console.error('Error stack:', error.stack);

    // 🔔 NOTIFICATION: Wallet Payment Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Wallet Payment Failed',
        message: `Failed to create gig using wallet balance. Error: ${error.message}`,
        data: {
          error: error.message,
          metadata: {
            failedAt: new Date(),
            errorType: 'wallet_payment_failed'
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Wallet failure notification failed:', notifyError);
    }

    next(error);
  }
};

module.exports = {
  createPaypalOrder,
  capturePaypalOrder,
  createGigWithWallet
};