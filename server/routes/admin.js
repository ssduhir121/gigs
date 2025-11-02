const express = require('express');
const { getStats, getUsers, getGigs, getShares } = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected and only for admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/gigs', getGigs);
router.get('/shares', getShares);

module.exports = router;