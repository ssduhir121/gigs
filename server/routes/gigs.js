// const express = require('express');
// const router = express.Router();
// const gigsController = require('../controllers/gigs');
// const paypalController = require('../controllers/paypalController');
// const { protect } = require('../middleware/auth');

// // PayPal routes - ADD PROTECT MIDDLEWARE
// router.post('/paypal/create-order', protect, paypalController.createPaypalOrder); // ✅ Add protect
// router.post('/paypal/capture', protect, paypalController.capturePaypalOrder); // ✅ Add protect

// // Public routes
// router.get('/', gigsController.getGigs);
// router.get('/track-share/:trackingToken', gigsController.trackShareClick);
// router.get('/media/:filename', gigsController.serveMedia); 
// // Protected routes - SPECIFIC ROUTES FIRST
// router.get('/my-gigs', protect, gigsController.getMyGigs);
// router.get('/my-shares', protect, gigsController.getMyShares);
// router.get('/shares/:trackingToken', protect, gigsController.getShareByToken);
// router.post('/create-with-wallet', protect, gigsController.createGigWithWallet);

// // ✅ FIXED: Move generate-share-url BEFORE the parameterized :id route
// router.post('/:id/generate-share-url', protect, gigsController.generateShareUrl);

// // Parameterized routes - THESE SHOULD BE LAST
// router.get('/:id', gigsController.getGig);

// module.exports = router;


const express = require('express');
const router = express.Router();
const gigsController = require('../controllers/gigs');
const paypalController = require('../controllers/paypalController');
const { protect } = require('../middleware/auth');

// PayPal routes
router.post('/paypal/create-order', protect, paypalController.createPaypalOrder);
router.post('/paypal/capture', protect, paypalController.capturePaypalOrder);

// Public routes
router.get('/', gigsController.getGigs);
router.get('/track-share/:trackingToken', gigsController.trackShareClick);
router.get('/media/:filename', gigsController.serveMedia);


router.post('/shares/:shareId/track-social-share', protect, gigsController.trackSocialShare);
// Protected routes - SPECIFIC ROUTES FIRST
router.get('/my-gigs', protect, gigsController.getMyGigs);
router.get('/my-shares', protect, gigsController.getMyShares);
router.get('/shares/:trackingToken', protect, gigsController.getShareByToken);
router.post('/create-with-wallet', protect, gigsController.createGigWithWallet);

// NEW: Add the getAvailableGigs route
router.get('/available/for-sharing', protect, gigsController.getAvailableGigs);

// Generate share URL route
router.post('/:id/generate-share-url', protect, gigsController.generateShareUrl);

// Parameterized routes - THESE SHOULD BE LAST
router.get('/:id', gigsController.getGig);

module.exports = router;