const express = require('express');
const { 
  getWallet, 
  getWalletStats, 
  withdrawFromWallet, 
  getWithdrawalHistory,
  getAdminCommission 
} = require('../controllers/wallet');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getWallet);
router.get('/stats', getWalletStats);
router.get('/withdrawals', getWithdrawalHistory);
router.post('/withdraw', withdrawFromWallet);

// Admin routes
router.get('/admin/commission', authorize('admin'), getAdminCommission);

module.exports = router;