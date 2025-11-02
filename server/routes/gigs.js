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
  getMyShares
} = require('../controllers/gigs');

router.get('/', getGigs);
router.get('/my-gigs', protect, getMyGigs);
router.get('/my-shares', protect, getMyShares);
router.get('/:id', getGig);
router.post('/', protect, createGig);
router.post('/:id/generate-share-url', protect, generateShareUrl);
router.get('/track-share/:trackingToken', trackShareClick);

module.exports = router;