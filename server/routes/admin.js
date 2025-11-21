// const express = require('express');
// const { getStats, getUsers, getGigs, getShares } = require('../controllers/admin');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// // All routes protected and only for admin
// router.use(protect);
// router.use(authorize('admin'));

// router.get('/stats', getStats);
// router.get('/users', getUsers);
// router.get('/gigs', getGigs);
// router.get('/shares', getShares);

// module.exports = router;


// routes/admin.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStats,
  getUsers,
  updateUserRole,
  getGigs,
  getShares,
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getPlatformEarnings,
  getFlaggedGigs,
  approveGig,
  rejectGig,
  getTopSharers,
  getTopCreators,
  getGigPerformance,
  getCompanies,getCompanyStats,getPendingCompanies,verifyCompany, updateCompanyStatus,rejectCompany
} = require('../controllers/admin');

// Admin middleware - protect and authorize admin only
const adminProtect = [protect, authorize('admin')];

// Stats and overview
router.get('/stats', adminProtect, getStats);
router.get('/platform-earnings', adminProtect, getPlatformEarnings);

// User management
router.get('/users', adminProtect, getUsers);
router.put('/users/:userId/role', adminProtect, updateUserRole);


// ✅ ADD: Company Management Routes
router.get('/companies', adminProtect, getCompanies);
router.get('/companies/pending', adminProtect, getPendingCompanies);
router.get('/companies/stats', adminProtect, getCompanyStats);
router.post('/companies/:companyId/verify', adminProtect, verifyCompany);
router.post('/companies/:companyId/reject', adminProtect, rejectCompany);
router.put('/companies/:companyId/status', adminProtect, updateCompanyStatus);

// Withdrawal management
router.get('/pending-withdrawals', adminProtect, getPendingWithdrawals);
router.post('/withdrawals/:withdrawalId/approve', adminProtect, approveWithdrawal);
router.post('/withdrawals/:withdrawalId/reject', adminProtect, rejectWithdrawal);

// Gig moderation
router.get('/gigs', adminProtect, getGigs);
router.get('/flagged-gigs', adminProtect, getFlaggedGigs);
router.post('/gigs/:gigId/approve', adminProtect, approveGig);
router.post('/gigs/:gigId/reject', adminProtect, rejectGig);

// Analytics routes
router.get('/analytics/top-sharers', adminProtect, getTopSharers);
router.get('/analytics/top-creators', adminProtect, getTopCreators);
router.get('/analytics/gig-performance', adminProtect, getGigPerformance);
// Shares and activity
router.get('/shares', adminProtect, getShares);

module.exports = router;