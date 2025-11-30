// routes/privateGigs.js
const express = require('express');
const router = express.Router();
const privateGigsController = require('../controllers/privateGigs');
const { protect } = require('../middleware/auth');

// Apply for private gig
router.post('/:id/apply', protect, privateGigsController.applyForPrivateGig);

// Get applications for a gig (gig owner only)
router.get('/:id/applications', protect, privateGigsController.getGigApplications);

// Get available private gigs for application
router.get('/private/available', protect, privateGigsController.getAvailablePrivateGigs);

module.exports = router;