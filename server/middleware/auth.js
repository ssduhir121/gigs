// // middleware/auth.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Protect routes
// exports.protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   // Make sure token exists
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized to access this route'
//     });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decoded.id);

//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized to access this route'
//     });
//   }
// };

// // Grant access to specific roles
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `User role ${req.user.role} is not authorized to access this route`
//       });
//     }
//     next();
//   };
// };


// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
// middleware/auth.js
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Populate company data for better access
    req.user = await User.findById(decoded.id)
      .select('+company +companyRole')
      .populate('company', 'name companyName email industry'); // Add populate here

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('🔐 User authenticated:', {
      id: req.user._id,
      email: req.user.email,
      company: req.user.company,
      companyRole: req.user.companyRole
    });

    next();
  } catch (error) {
    console.error('❌ Auth error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Company-specific authorization
exports.requireCompany = (req, res, next) => {
  if (!req.user.company) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. User must belong to a company.'
    });
  }
  next();
};

// middleware/auth.js
exports.requireCompanyAdmin = (req, res, next) => {
  console.log('🔐 requireCompanyAdmin middleware called');
  console.log('User ID:', req.user._id);
  console.log('User company:', req.user.company);
  console.log('User companyRole:', req.user.companyRole);
  console.log('User companyRole type:', typeof req.user.companyRole);
  console.log('Allowed roles:', ['admin', 'owner']);
  
  if (!req.user.company) {
    console.log('❌ No company found');
    return res.status(403).json({
      success: false,
      message: 'Access denied. User must belong to a company.'
    });
  }
  
  if (!['admin', 'owner'].includes(req.user.companyRole)) {
    console.log('❌ Invalid company role:', req.user.companyRole);
    return res.status(403).json({
      success: false,
      message: 'Access denied. Company admin privileges required.'
    });
  }
  
  console.log('✅ Company admin access granted');
  next();
};


exports.requireCompanyManager = (req, res, next) => {
  if (!req.user.company) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. User must belong to a company.'
    });
  }
  
  if (!['admin', 'owner', 'manager'].includes(req.user.companyRole)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Company manager privileges required.'
    });
  }
  next();
};