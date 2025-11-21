const express = require('express');
const router = express.Router();
const { createPayout } = require('../controllers/withdrawalController');
const { protect } = require('../middleware/auth'); // assuming you have JWT auth


const { 
  createWithdrawal, 
  getMyWithdrawals, 
  getPaypalStatus, 
  linkPaypalAccount 
} = require('../controllers/withdrawals');

// POST /api/withdrawals/payout
router.post('/payout', protect, createPayout);
router.post('/', protect, createWithdrawal);
router.get('/', protect, getMyWithdrawals);
router.get('/paypal-status', protect, getPaypalStatus);
router.post('/link-paypal', protect, linkPaypalAccount);
module.exports = router;
