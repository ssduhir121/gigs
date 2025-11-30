// routes/paypalRoutes.js
const express = require('express');
const { createPaypalOrder, capturePaypalOrder } = require('../controllers/paypalController');
const { handleWebhook } = require('../controllers/paypalWebhook');
const { verifyWebhook } = require('../middleware/paypalWebhookMiddleware');
const { protect } = require('../middleware/auth');

const router = express.Router();

// PayPal order creation
router.post('/create-order', protect, createPaypalOrder);

// PayPal order capture
router.post('/capture-order', protect, capturePaypalOrder);

// PayPal webhook (optional)
router.post('/webhook', express.json({ type: '*/*' }), verifyWebhook, handleWebhook);

module.exports = router;
