// routes/gigs.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getGigs,
  getGig,
  createGig,
  generateShareUrl,
  trackShareClick,
  getMyGigs,
  getMyShares,
  createGigWithWallet,
  getShareByToken
} = require('../controllers/gigs');

router.get('/', getGigs);
router.get('/my-gigs', protect, getMyGigs);
router.get('/my-shares', protect, getMyShares);
router.get('/shares/:trackingToken', protect, getShareByToken);
// TRACK-SHARE MUST COME BEFORE :id
router.get('/track-share/:trackingToken', trackShareClick);

// This comes AFTER specific routes
router.get('/:id', getGig);
router.post('/', protect, createGig);
router.post('/create-with-wallet', protect, createGigWithWallet);
router.post('/:id/generate-share-url', protect, generateShareUrl);

module.exports = router;