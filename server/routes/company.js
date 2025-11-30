// // routes/company.js
// const express = require('express');
// const router = express.Router();
// const companyController = require('../controllers/companyController.js');
// const { 
//   protect, 
//   requireCompany, 
//   requireCompanyAdmin, 
//   requireCompanyManager 
// } = require('../middleware/auth');





// // All routes are protected and require company membership
// router.use(protect, requireCompany);


// // Add this to your company routes temporarily
// router.get('/debug-user', protect, async (req, res) => {
//   try {
//     res.json({
//       success: true,
//       user: {
//         id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         company: req.user.company,
//         companyRole: req.user.companyRole,
//         role: req.user.role
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Debug error'
//     });
//   }
// });

// // Dashboard
// router.get('/dashboard', companyController.getCompanyDashboard);

// // Profile routes
// router.route('/profile')
//   .get(companyController.getCompanyProfile)
//   .put(requireCompanyManager, companyController.updateCompanyProfile);

// // Gigs routes
// router.get('/gigs', companyController.getCompanyGigs);
// router.get('/gigs/analytics', companyController.getGigAnalytics);

// // Shares routes
// router.get('/shares', companyController.getCompanyShares);

// // Team routes
// router.get('/team', companyController.getCompanyTeam);
// router.put('/team/:userId/role', requireCompanyAdmin, companyController.updateTeamMemberRole);
// router.delete('/team/:userId', requireCompanyAdmin, companyController.removeTeamMember);

// // Financial routes
// router.get('/financials', companyController.getFinancialOverview);

// // Invitation routes
// router.get('/invitations', companyController.getCompanyInvitations);
// router.post('/invite', requireCompanyManager, companyController.inviteToCompany);

// // Settings routes - requires admin
// router.get('/settings', requireCompanyAdmin, companyController.getCompanySettings);

// // Export routes
// router.get('/export', companyController.exportCompanyData);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  registerCompany,
  getCompanyDashboard,
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyGigs,
  getGigAnalytics,
  getCompanyShares,
  getCompanyTeam,
  updateTeamMemberRole,
  removeTeamMember,
  getFinancialOverview,
  getCompanyInvitations,
  inviteToCompany,
  getCompanySettings,
  exportCompanyData
} = require('../controllers/companyController');

const { protect, requireCompany, requireCompanyAdmin, requireCompanyManager } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Company registration
router.post('/register', registerCompany);

// Dashboard and analytics - available to all company members
router.get('/dashboard', requireCompany, getCompanyDashboard);
router.get('/stats', requireCompany, getCompanyDashboard);
router.get('/analytics', requireCompany, getCompanyDashboard);

// Profile and settings - admin/owner only for settings
router.route('/profile')
  .get(requireCompany, getCompanyProfile)
  .put(requireCompany, updateCompanyProfile);

// FIX: Add requireCompanyAdmin middleware for settings
router.get('/settings', requireCompany, requireCompanyAdmin, getCompanySettings);

// Gigs management - available to all company members
router.get('/gigs', requireCompany, getCompanyGigs);
router.get('/gigs/analytics', requireCompany, getGigAnalytics);
router.get('/recent-gigs', requireCompany, getCompanyGigs);

// Shares management - available to all company members
router.get('/shares', requireCompany, getCompanyShares);
router.get('/recent-shares', requireCompany, getCompanyShares);

// Team management - different access levels
router.get('/team', requireCompany, getCompanyTeam);
router.get('/team-members', requireCompany, getCompanyTeam);
router.get('/team-performance', requireCompany, getCompanyDashboard);
// FIX: Team modification routes require admin/manager privileges
router.put('/team/:userId/role', requireCompany, requireCompanyManager, updateTeamMemberRole);
router.delete('/team/:userId', requireCompany, requireCompanyAdmin, removeTeamMember);

// Financial management - admin/owner only
router.get('/financials', requireCompany, requireCompanyAdmin, getFinancialOverview);
router.get('/earnings', requireCompany, requireCompanyAdmin, getFinancialOverview);
router.get('/withdrawals', requireCompany, requireCompanyAdmin, getFinancialOverview);

// Invitations management - admin/owner only
router.get('/invitations', requireCompany, requireCompanyAdmin, getCompanyInvitations);
router.post('/invite', requireCompany, requireCompanyAdmin, inviteToCompany);

// Export data - admin/owner only
router.get('/export', requireCompany, requireCompanyAdmin, exportCompanyData);

// Fallback routes for unimplemented methods
router.get('/applications', requireCompany, (req, res) => {
  res.json({ 
    success: true, 
    data: [],
    message: 'Applications feature coming soon'
  });
});

router.put('/applications/:applicationId/status', requireCompany, requireCompanyManager, (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Application status update not implemented yet' 
  });
});

router.get('/invites', requireCompany, requireCompanyAdmin, getCompanyInvitations);

router.post('/invitations/:invitationId/resend', requireCompany, requireCompanyAdmin, (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Resend invitation not implemented yet' 
  });
});

router.delete('/invitations/:invitationId', requireCompany, requireCompanyAdmin, (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Cancel invitation not implemented yet' 
  });
});

// Additional gig invitation routes
router.get('/gigs/:gigId/available-for-invite', requireCompany, (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Available gigs for invite not implemented yet' 
  });
});

router.post('/gigs/:gigId/invite-user', requireCompany, requireCompanyManager, (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Invite user to gig not implemented yet' 
  });
});

router.get('/gigs/:gigId/invitations', requireCompany, (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Gig invitations not implemented yet' 
  });
});

module.exports = router;