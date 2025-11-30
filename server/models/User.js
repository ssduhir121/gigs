// // models/User.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Please add a name'],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, 'Please add an email'],
//       unique: true,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         'Please add a valid email',
//       ],
//     },
//     password: {
//       type: String,
//       required: [true, 'Please add a password'],
//       minlength: 6,
//     },
//     walletBalance: {
//       type: mongoose.Schema.Types.Decimal128,
//       default: 0.0,
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin', 'company', 'moderator'],
//       default: 'user',
//     },
    
//     // ✅ ADD: PayPal Linking Fields
//     paypalEmail: {
//       type: String,
//       default: null,
//       match: [
//         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//         'Please add a valid PayPal email',
//       ],
//     },
//     paypalVerified: {
//       type: Boolean,
//       default: false,
//     },
//     withdrawalMethod: {
//       type: String,
//       enum: ['paypal', 'wallet'],
//       default: 'paypal',
//     },
    
//     withdrawals: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Withdrawal',
//       },
//     ],
//       googleId: {
//       type: String,
//       sparse: true,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     verificationToken: String,
//     verificationTokenExpires: Date,
//     resetPasswordToken: String,
//     resetPasswordExpires: Date,
//     otp: String,
//     otpExpires: Date,
//   },
  
//   { timestamps: true }
// );

// // Encrypt password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Match user-entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // Safely get wallet balance as Number
// userSchema.methods.getWalletBalance = function () {
//   return parseFloat(this.walletBalance.toString());
// };

// // Safely increment wallet balance (use sessions for transactions)
// userSchema.methods.incrementWallet = function (amount) {
//   const current = this.getWalletBalance();
//   this.walletBalance = (current + amount).toFixed(2);
//   return this.walletBalance;
// };

// // ✅ ADD: Method to link PayPal account
// userSchema.methods.linkPaypalAccount = function (paypalEmail) {
//   this.paypalEmail = paypalEmail;
//   this.paypalVerified = false; // Can be verified later
//   this.withdrawalMethod = 'paypal';
//   return this.save();
// };

// userSchema.methods.generateVerificationToken = function() {
//   const token = crypto.randomBytes(20).toString('hex');
//   this.verificationToken = crypto.createHash('sha256').update(token).toString('hex');
//   this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
//   return token;
// };

// userSchema.methods.generateResetToken = function() {
//   const token = crypto.randomBytes(20).toString('hex');
//   this.resetPasswordToken = crypto.createHash('sha256').update(token).toString('hex');
//   this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
//   return token;
// };
// userSchema.methods.generateOTP = function() {
//   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//   this.otp = crypto.createHash('sha256').update(otp).toString('hex');
//   this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//   return otp;
// };

// // ✅ ADD: Method to check if PayPal is linked
// userSchema.methods.hasPaypalLinked = function () {
//   return !!this.paypalEmail;
// };

// module.exports = mongoose.model('User', userSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // ✅ ADD: Import crypto

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    walletBalance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0.0,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'company', 'moderator'],
      default: 'user',
    },
    
    // PayPal Linking Fields
    paypalEmail: {
      type: String,
      default: null,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid PayPal email',
      ],
    },
    paypalVerified: {
      type: Boolean,
      default: false,
    },
    withdrawalMethod: {
      type: String,
      enum: ['paypal', 'wallet'],
      default: 'paypal',
    },
    
    withdrawals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Withdrawal',
      },
    ],
    
    // ✅ ADD: Google OAuth fields
    googleId: {
      type: String,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
       profilePicture: {
      type: String,
      default: null
    },
    
    // Additional Profile Fields
    phone: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
      default: null
    },
    location: {
      type: String,
      default: null
    },
    
    // Social Media Links (optional)
    socialMedia: {
      twitter: { type: String, default: null },
      facebook: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null }
    },
    
    company: {
  type: mongoose.Schema.ObjectId,
  ref: 'Company'
},
companyRole: {
  type: String,
  enum: ['owner', 'admin', 'manager', 'member', null],
  default: null
},
// 💰 PHASE 2: Advanced company features (commented)
/*
companyPermissions: [String],
department: String,
companyJoinDate: Date
*/
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user-entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Safely get wallet balance as Number
userSchema.methods.getWalletBalance = function () {
  return parseFloat(this.walletBalance.toString());
};

// Safely increment wallet balance (use sessions for transactions)
userSchema.methods.incrementWallet = function (amount) {
  const current = this.getWalletBalance();
  this.walletBalance = (current + amount).toFixed(2);
  return this.walletBalance;
};

// Method to link PayPal account
userSchema.methods.linkPaypalAccount = function (paypalEmail) {
  this.paypalEmail = paypalEmail;
  this.paypalVerified = false; // Can be verified later
  this.withdrawalMethod = 'paypal';
  return this.save();
};

// Method to check if PayPal is linked
userSchema.methods.hasPaypalLinked = function () {
  return !!this.paypalEmail;
};

// ✅ ADD: Method to generate verification token
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(token).toString('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// ✅ ADD: Method to generate reset token
userSchema.methods.generateResetToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).toString('hex');
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return token;
};

// ✅ ADD: Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = crypto.createHash('sha256').update(otp).toString('hex');
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

module.exports = mongoose.model('User', userSchema);