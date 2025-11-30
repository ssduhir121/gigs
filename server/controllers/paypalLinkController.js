// // controllers/paypalLinkController.js
// const User = require('../models/User');

// // Link PayPal account
// exports.linkPaypalAccount = async (req, res, next) => {
//   try {
//     const { paypalEmail } = req.body;
//     const userId = req.user.id;

//     if (!paypalEmail) {
//       return res.status(400).json({
//         success: false,
//         message: 'PayPal email is required'
//       });
//     }

//     // Validate email format
//     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     if (!emailRegex.test(paypalEmail)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please enter a valid PayPal email address'
//       });
//     }

//     // Check if email is different from account email
//     const user = await User.findById(userId);
//     if (paypalEmail.toLowerCase() === user.email.toLowerCase()) {
//       return res.status(400).json({
//         success: false,
//         message: 'PayPal email cannot be the same as your account email'
//       });
//     }

//     // Update user with PayPal email
//     await user.linkPaypalAccount(paypalEmail);

//     res.status(200).json({
//       success: true,
//       message: 'PayPal account linked successfully!',
//       data: {
//         paypalEmail: user.paypalEmail,
//         paypalVerified: user.paypalVerified,
//         withdrawalMethod: user.withdrawalMethod
//       }
//     });

//   } catch (error) {
//     console.error('PayPal linking error:', error);
    
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'This PayPal email is already linked to another account'
//       });
//     }
    
//     next(error);
//   }
// };

// // Get PayPal linking status
// exports.getPaypalStatus = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).select('paypalEmail paypalVerified withdrawalMethod');

//     res.status(200).json({
//       success: true,
//       data: {
//         paypalLinked: user.hasPaypalLinked(),
//         paypalEmail: user.paypalEmail,
//         paypalVerified: user.paypalVerified,
//         withdrawalMethod: user.withdrawalMethod
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Unlink PayPal account
// exports.unlinkPaypalAccount = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
    
//     user.paypalEmail = null;
//     user.paypalVerified = false;
//     user.withdrawalMethod = 'wallet'; // Default back to wallet
    
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'PayPal account unlinked successfully',
//       data: {
//         paypalLinked: false,
//         withdrawalMethod: 'wallet'
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// controllers/paypalLinkController.js
const User = require('../models/User');
const NotificationService = require('../utils/notificationService');

// Link PayPal account
exports.linkPaypalAccount = async (req, res, next) => {
  try {
    const { paypalEmail } = req.body;
    const userId = req.user.id;

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

    // Check if email is different from account email
    const user = await User.findById(userId);
    if (paypalEmail.toLowerCase() === user.email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'PayPal email cannot be the same as your account email'
      });
    }

    // Update user with PayPal email
    await user.linkPaypalAccount(paypalEmail);

    // 🔔 NOTIFICATION: PayPal Account Linked Successfully
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'PayPal Account Linked',
        message: `Your PayPal account (${paypalEmail}) has been successfully linked for withdrawals.`,
        data: {
          paypalEmail: paypalEmail,
          withdrawalMethod: 'paypal',
          metadata: {
            linkedAt: new Date(),
            verified: false
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('PayPal linking notification failed:', notifyError);
    }

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
    
    // 🔔 NOTIFICATION: PayPal Linking Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'PayPal Linking Failed',
        message: `Failed to link your PayPal account. ${error.message || 'Please try again.'}`,
        data: {
          error: error.message,
          paypalEmail: req.body.paypalEmail,
          metadata: {
            failedAt: new Date(),
            errorCode: error.code
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('PayPal linking failure notification failed:', notifyError);
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This PayPal email is already linked to another account'
      });
    }
    
    next(error);
  }
};

// Get PayPal linking status
exports.getPaypalStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('paypalEmail paypalVerified withdrawalMethod');

    res.status(200).json({
      success: true,
      data: {
        paypalLinked: user.hasPaypalLinked(),
        paypalEmail: user.paypalEmail,
        paypalVerified: user.paypalVerified,
        withdrawalMethod: user.withdrawalMethod
      }
    });
  } catch (error) {
    next(error);
  }
};

// Unlink PayPal account
exports.unlinkPaypalAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    const previousPaypalEmail = user.paypalEmail;
    
    user.paypalEmail = null;
    user.paypalVerified = false;
    user.withdrawalMethod = 'wallet'; // Default back to wallet
    
    await user.save();

    // 🔔 NOTIFICATION: PayPal Account Unlinked
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'PayPal Account Unlinked',
        message: `Your PayPal account (${previousPaypalEmail}) has been unlinked from your account. Withdrawals will now go to your wallet.`,
        data: {
          previousPaypalEmail: previousPaypalEmail,
          newWithdrawalMethod: 'wallet',
          metadata: {
            unlinkedAt: new Date(),
            previousMethod: 'paypal'
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('PayPal unlinking notification failed:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: 'PayPal account unlinked successfully',
      data: {
        paypalLinked: false,
        withdrawalMethod: 'wallet'
      }
    });
  } catch (error) {
    // 🔔 NOTIFICATION: PayPal Unlinking Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'PayPal Unlinking Failed',
        message: `Failed to unlink your PayPal account. Please try again.`,
        data: {
          error: error.message,
          metadata: {
            failedAt: new Date()
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('PayPal unlinking failure notification failed:', notifyError);
    }
    
    next(error);
  }
};

// Verify PayPal account (Admin function)
exports.verifyPaypalAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can verify PayPal accounts'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.paypalEmail) {
      return res.status(400).json({
        success: false,
        message: 'User does not have a PayPal account linked'
      });
    }

    // Verify the PayPal account
    user.paypalVerified = true;
    await user.save();

    // 🔔 NOTIFICATION: PayPal Account Verified (to user)
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'PayPal Account Verified',
        message: `Your PayPal account (${user.paypalEmail}) has been verified and is ready for withdrawals!`,
        data: {
          paypalEmail: user.paypalEmail,
          verified: true,
          verifiedBy: req.user.id,
          metadata: {
            verifiedAt: new Date(),
            verifiedByAdmin: req.user.name
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('PayPal verification notification failed:', notifyError);
    }

    // 🔔 NOTIFICATION: PayPal Account Verified (to admin)
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'PayPal Account Verified',
        message: `You successfully verified PayPal account for user ${user.name} (${user.paypalEmail}).`,
        data: {
          verifiedUserId: userId,
          verifiedUserName: user.name,
          paypalEmail: user.paypalEmail,
          metadata: {
            verifiedAt: new Date(),
            userEmail: user.email
          }
        },
        priority: 'low'
      });
    } catch (notifyError) {
      console.error('Admin PayPal verification notification failed:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: 'PayPal account verified successfully',
      data: {
        userId: user._id,
        userName: user.name,
        paypalEmail: user.paypalEmail,
        paypalVerified: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update withdrawal method
exports.updateWithdrawalMethod = async (req, res, next) => {
  try {
    const { withdrawalMethod } = req.body;
    const userId = req.user.id;

    if (!['wallet', 'paypal'].includes(withdrawalMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid withdrawal method. Must be "wallet" or "paypal"'
      });
    }

    const user = await User.findById(userId);

    // If switching to PayPal, check if PayPal is linked and verified
    if (withdrawalMethod === 'paypal') {
      if (!user.paypalEmail) {
        return res.status(400).json({
          success: false,
          message: 'Please link your PayPal account before selecting it as withdrawal method'
        });
      }

      if (!user.paypalVerified) {
        return res.status(400).json({
          success: false,
          message: 'Your PayPal account needs to be verified before you can use it for withdrawals'
        });
      }
    }

    const previousMethod = user.withdrawalMethod;
    user.withdrawalMethod = withdrawalMethod;
    await user.save();

    // 🔔 NOTIFICATION: Withdrawal Method Updated
    try {
      await NotificationService.createNotification({
        userId: userId,
        type: 'system_announcement',
        title: 'Withdrawal Method Updated',
        message: `Your withdrawal method has been changed from ${previousMethod} to ${withdrawalMethod}.`,
        data: {
          previousMethod: previousMethod,
          newMethod: withdrawalMethod,
          paypalEmail: withdrawalMethod === 'paypal' ? user.paypalEmail : null,
          metadata: {
            updatedAt: new Date()
          }
        },
        priority: 'medium'
      });
    } catch (notifyError) {
      console.error('Withdrawal method update notification failed:', notifyError);
    }

    res.status(200).json({
      success: true,
      message: `Withdrawal method updated to ${withdrawalMethod}`,
      data: {
        withdrawalMethod: user.withdrawalMethod,
        paypalEmail: user.paypalEmail,
        paypalVerified: user.paypalVerified
      }
    });
  } catch (error) {
    // 🔔 NOTIFICATION: Withdrawal Method Update Failed
    try {
      await NotificationService.createNotification({
        userId: req.user.id,
        type: 'system_announcement',
        title: 'Withdrawal Method Update Failed',
        message: `Failed to update your withdrawal method. Please try again.`,
        data: {
          error: error.message,
          requestedMethod: req.body.withdrawalMethod,
          metadata: {
            failedAt: new Date()
          }
        },
        priority: 'high'
      });
    } catch (notifyError) {
      console.error('Withdrawal method update failure notification failed:', notifyError);
    }
    
    next(error);
  }
};