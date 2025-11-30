// routes/applications.js
const express = require('express');
const router = express.Router();
const privateGigsController = require('../controllers/privateGigs');
const { protect } = require('../middleware/auth');

// Application management
router.get('/my-applications', protect, privateGigsController.getMyApplications);
router.post('/:applicationId/approve', protect, privateGigsController.approveApplication);
router.post('/:applicationId/reject', protect, privateGigsController.rejectApplication);

module.exports = router;