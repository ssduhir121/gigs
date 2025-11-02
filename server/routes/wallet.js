// routes/wallet.js
const express = require('express');
const { getWallet, getWalletStats, withdrawFromWallet } = require('../controllers/wallet');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getWallet);
router.get('/stats', getWalletStats);
router.post('/withdraw', withdrawFromWallet);

module.exports = router;