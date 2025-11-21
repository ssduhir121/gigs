// const express = require('express');
// const { register, login, getMe } = require('../controllers/auth.js');
// const { protect } = require('../middleware/auth.js');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  verifyOTP,
  resendOTP,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');
const { registerCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/company/register', protect, registerCompany);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;