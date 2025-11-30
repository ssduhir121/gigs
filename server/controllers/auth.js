
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const { OAuth2Client } = require('google-auth-library');

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // ✅ FIX: Use createTransport instead of createTransporter
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// // Generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// // @desc    Register user
// // @route   POST /api/auth/register
// // @access  Public
// exports.register = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email'
//       });
//     }

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password,
//       isVerified: false
//     });

//     // Generate and send OTP
//     const otp = user.generateOTP();
//     await user.save();

//     // Send OTP email
//     await sendOTPEmail(user.email, otp, user.name);

//     res.status(201).json({
//       success: true,
//       message: 'OTP sent to your email. Please verify to complete registration.',
//       data: {
//         id: user._id,
//         email: user.email,
//         requiresVerification: true
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// exports.login = async (req, res, next) => {
//   console.log(req.body)
//   try {
//     const { email, password } = req.body;

//     // Validate email & password
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide an email and password'
//       });
//     }

//     // Check for user
//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Check if user is verified
//     if (!user.isVerified) {
//       return res.status(401).json({
//         success: false,
//         message: 'Please verify your email before logging in'
//       });
//     }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Generate token
//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       token,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         walletBalance: user.walletBalance,
//         role: user.role,
//         isVerified: user.isVerified
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Verify OTP
// // @route   POST /api/auth/verify-otp
// // @access  Public
// exports.verifyOTP = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Check if OTP is valid and not expired
//     const hashedOTP = crypto.createHash('sha256').update(otp).toString('hex');
    
//     if (user.otp !== hashedOTP) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid OTP'
//       });
//     }

//     if (user.otpExpires < Date.now()) {
//       return res.status(400).json({
//         success: false,
//         message: 'OTP has expired'
//       });
//     }

//     // Mark user as verified and clear OTP
//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     // Generate token
//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       message: 'Email verified successfully',
//       token,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         walletBalance: user.walletBalance,
//         role: user.role,
//         isVerified: user.isVerified
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Resend OTP
// // @route   POST /api/auth/resend-otp
// // @access  Public
// exports.resendOTP = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     if (user.isVerified) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email is already verified'
//       });
//     }

//     // Generate new OTP
//     const otp = user.generateOTP();
//     await user.save();

//     // Send OTP email
//     await sendOTPEmail(user.email, otp, user.name);

//     res.status(200).json({
//       success: true,
//       message: 'New OTP sent to your email'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Google OAuth
// // @route   POST /api/auth/google
// // @access  Public
// exports.googleAuth = async (req, res, next) => {
//   try {
//     const { token } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { sub: googleId, email, name, picture } = ticket.getPayload();

//     let user = await User.findOne({ 
//       $or: [{ googleId }, { email }] 
//     });

//     if (user) {
//       // Update googleId if logging in with existing email
//       if (!user.googleId) {
//         user.googleId = googleId;
//         await user.save();
//       }
//     } else {
//       // Create new user with Google
//       user = await User.create({
//         googleId,
//         name,
//         email,
//         password: crypto.randomBytes(20).toString('hex'), // Random password
//         isVerified: true, // Google emails are verified
//       });
//     }

//     const authToken = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       token: authToken,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         walletBalance: user.walletBalance,
//         role: user.role,
//         isVerified: user.isVerified
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Forgot password
// // @route   POST /api/auth/forgot-password
// // @access  Public
// exports.forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'No user found with this email'
//       });
//     }

//     // Generate reset token
//     const resetToken = user.generateResetToken();
//     await user.save();

//     // Send reset email
//     await sendResetEmail(user.email, resetToken, user.name);

//     res.status(200).json({
//       success: true,
//       message: 'Password reset instructions sent to your email'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Reset password
// // @route   PUT /api/auth/reset-password/:resetToken
// // @access  Public
// exports.resetPassword = async (req, res, next) => {
//   try {
//     const { resetToken } = req.params;
//     const { password } = req.body;

//     // Hash token to compare with stored token
//     const hashedToken = crypto.createHash('sha256').update(resetToken).toString('hex');

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired reset token'
//       });
//     }

//     // Set new password
//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Password reset successful'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// // exports.getMe = async (req, res, next) => {
// //   try {
// //     const user = await User.findById(req.user.id);

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         walletBalance: user.walletBalance,
// //         role: user.role,
// //         isVerified: user.isVerified
// //       }
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };



// // In your authController.js - getMe method
// exports.getMe = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select('-password') // Exclude password
//       .populate('company', 'companyName businessEmail verificationStatus'); // ✅ ADD: Populate company

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         walletBalance: user.walletBalance,
//         role: user.role,
//         isVerified: user.isVerified,
//         company: user.company, // ✅ ADD: Company reference
//         companyRole: user.companyRole, // ✅ ADD: Company role
//         // ... other fields
//       }
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// // Helper function to send OTP email
// const sendOTPEmail = async (email, otp, name) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: email,
//       subject: 'Verify Your Email - OTP Required',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Email Verification</h2>
//           <p>Hello ${name},</p>
//           <p>Thank you for registering! Use the OTP below to verify your email address:</p>
//           <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
//             <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
//           </div>
//           <p>This OTP will expire in 10 minutes.</p>
//           <p>If you didn't create an account, please ignore this email.</p>
//         </div>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending OTP email:', error);
//     throw new Error('Failed to send OTP email');
//   }
// };

// // Helper function to send reset email
// const sendResetEmail = async (email, resetToken, name) => {
//   try {
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: email,
//       subject: 'Password Reset Request',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333;">Password Reset</h2>
//           <p>Hello ${name},</p>
//           <p>You requested to reset your password. Click the link below to reset it:</p>
//           <div style="text-align: center; margin: 20px 0;">
//             <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
//               Reset Password
//             </a>
//           </div>
//           <p>This link will expire in 30 minutes.</p>
//           <p>If you didn't request this, please ignore this email.</p>
//         </div>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending reset email:', error);
//     throw new Error('Failed to send reset email');
//   }
// };


const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to format user data for responses
const formatUserResponse = (user) => {
  const userData = user.toObject ? user.toObject() : { ...user };
  
  // Fix image path for frontend
  if (userData.profilePicture) {
    userData.profilePicture = userData.profilePicture.replace(/\\/g, '/');
    userData.profilePicture = userData.profilePicture.replace(/^\/+/, '');
  }
  
  return userData;
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false
    });

    // Generate and send OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otp, user.name);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
      data: {
        id: user._id,
        email: user.email,
        requiresVerification: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: formatUserResponse(user) // Use the helper function
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if OTP is valid and not expired
    const hashedOTP = crypto.createHash('sha256').update(otp).toString('hex');
    
    if (user.otp !== hashedOTP) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      data: formatUserResponse(user) // Use the helper function
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otp, user.name);

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });

    if (user) {
      // Update googleId if logging in with existing email
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user with Google
      user = await User.create({
        googleId,
        name,
        email,
        password: crypto.randomBytes(20).toString('hex'), // Random password
        isVerified: true, // Google emails are verified
        profilePicture: picture // Use Google profile picture
      });
    }

    const authToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: authToken,
      data: formatUserResponse(user) // Use the helper function
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this email'
      });
    }

    // Generate reset token
    const resetToken = user.generateResetToken();
    await user.save();

    // Send reset email
    await sendResetEmail(user.email, resetToken, user.name);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    // Hash token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(resetToken).toString('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password') // Exclude password
      .populate('company', 'companyName businessEmail verificationStatus');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Use the helper function to format user data
    const userData = formatUserResponse(user);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to send OTP email
const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Verify Your Email - OTP Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering! Use the OTP below to verify your email address:</p>
          <div style="background: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Helper function to send reset email
const sendResetEmail = async (email, resetToken, name) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Hello ${name},</p>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send reset email');
  }
};