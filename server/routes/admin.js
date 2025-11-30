

// // routes/admin.js
// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');
// const {
//   getStats,
//   getUsers,
//   updateUserRole,
//   getGigs,
//   getShares,
//   getPendingWithdrawals,
//   approveWithdrawal,
//   rejectWithdrawal,
//   getPlatformEarnings,
//   getFlaggedGigs,
//   approveGig,
//   rejectGig,
//   getTopSharers,
//   getTopCreators,
//   getGigPerformance,
//   getPrivateGigStats,
//   getRecentApplications,
//   getApplicationAnalytics,
//   getApplications,
//   approveApplication,
//   rejectApplication,
//   getCompanies,getCompanyStats,getPendingCompanies,verifyCompany, updateCompanyStatus,rejectCompany
// } = require('../controllers/admin');

// // Admin middleware - protect and authorize admin only
// const adminProtect = [protect, authorize('admin')];

// // Stats and overview
// router.get('/stats', adminProtect, getStats);
// router.get('/platform-earnings', adminProtect, getPlatformEarnings);

// // User management
// router.get('/users', adminProtect, getUsers);
// router.put('/users/:userId/role', adminProtect, updateUserRole);


// // ✅ ADD: Company Management Routes
// router.get('/companies', adminProtect, getCompanies);
// router.get('/companies/pending', adminProtect, getPendingCompanies);
// router.get('/companies/stats', adminProtect, getCompanyStats);
// router.post('/companies/:companyId/verify', adminProtect, verifyCompany);
// router.post('/companies/:companyId/reject', adminProtect, rejectCompany);
// router.put('/companies/:companyId/status', adminProtect, updateCompanyStatus);

// // Withdrawal management
// router.get('/pending-withdrawals', adminProtect, getPendingWithdrawals);
// router.post('/withdrawals/:withdrawalId/approve', adminProtect, approveWithdrawal);
// router.post('/withdrawals/:withdrawalId/reject', adminProtect, rejectWithdrawal);

// // Gig moderation
// router.get('/gigs', adminProtect, getGigs);
// router.get('/flagged-gigs', adminProtect, getFlaggedGigs);
// router.post('/gigs/:gigId/approve', adminProtect, approveGig);
// router.post('/gigs/:gigId/reject', adminProtect, rejectGig);

// // Analytics routes
// router.get('/analytics/top-sharers', adminProtect, getTopSharers);
// router.get('/analytics/top-creators', adminProtect, getTopCreators);
// router.get('/analytics/gig-performance', adminProtect, getGigPerformance);

// // routes/admin.js - ADD THESE ROUTES

// // Private gig management routes
// router.get('/private-gigs/stats', adminProtect, getPrivateGigStats);
// router.get('/applications/recent', adminProtect, getRecentApplications);
// router.get('/applications/analytics', adminProtect, getApplicationAnalytics);
// router.get('/applications', adminProtect, getApplications);
// router.post('/applications/:applicationId/approve', adminProtect, approveApplication);
// router.post('/applications/:applicationId/reject', adminProtect, rejectApplication);
// // Shares and activity
// router.get('/shares', adminProtect, getShares);

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
  getPrivateGigStats,
  getRecentApplications,
  getApplicationAnalytics,
  getApplications,
  approveApplication,
  rejectApplication,
  getCompanies,
  getCompanyStats,
  getPendingCompanies,
  verifyCompany,
  updateCompanyStatus,
  rejectCompany,
  // ✅ ADD: Invitation Management Controllers
  getInvitations,
  getInvitationStats,
  acceptInvitation,
  rejectInvitation,
  sendInvitationAsAdmin,
  deleteInvitation,
  getSocialShareAnalytics
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
router.get('/shares/:shareId/social-analytics', protect, getSocialShareAnalytics);
// Private gig management routes
router.get('/private-gigs/stats', adminProtect, getPrivateGigStats);
router.get('/applications/recent', adminProtect, getRecentApplications);
router.get('/applications/analytics', adminProtect, getApplicationAnalytics);
router.get('/applications', adminProtect, getApplications);
router.post('/applications/:applicationId/approve', adminProtect, approveApplication);
router.post('/applications/:applicationId/reject', adminProtect, rejectApplication);

// ✅ ADD: Invitation Management Routes
router.get('/invitations', adminProtect, getInvitations);
router.get('/invitations/stats', adminProtect, getInvitationStats);
router.post('/invitations/:invitationId/accept', adminProtect, acceptInvitation);
router.post('/invitations/:invitationId/reject', adminProtect, rejectInvitation);
router.post('/invitations/send', adminProtect, sendInvitationAsAdmin);
router.delete('/invitations/:invitationId', adminProtect, deleteInvitation);

// Shares and activity
router.get('/shares', adminProtect, getShares);

module.exports = router;