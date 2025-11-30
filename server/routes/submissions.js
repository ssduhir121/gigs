// // routes/submissions.js
// const express = require('express');
// const {
//   submitProof,
//   approveSubmission,
//   rejectSubmission,
//   getGigSubmissions
// } = require('../controllers/submissionController');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // Protected routes
// router.use(protect);

// router.post('/shares/:shareId/submit-proof', submitProof);
// router.post('/shares/:shareId/approve', approveSubmission);
// router.post('/shares/:shareId/reject', rejectSubmission);
// router.get('/gigs/:gigId/submissions', getGigSubmissions);

// module.exports = router;


// routes/submissions.js
const express = require('express');
const {
  submitProof,
  approveSubmission,
  rejectSubmission,
  getGigSubmissions
} = require('../controllers/submissionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/shares/:shareId/submit-proof', submitProof);
router.post('/shares/:shareId/approve', approveSubmission);
router.post('/shares/:shareId/reject', rejectSubmission);
router.get('/gigs/:gigId/submissions', getGigSubmissions);

module.exports = router;