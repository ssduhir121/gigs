// controllers/paypalLinkController.js
const User = require('../models/User');

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
    
    user.paypalEmail = null;
    user.paypalVerified = false;
    user.withdrawalMethod = 'wallet'; // Default back to wallet
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'PayPal account unlinked successfully',
      data: {
        paypalLinked: false,
        withdrawalMethod: 'wallet'
      }
    });
  } catch (error) {
    next(error);
  }
};