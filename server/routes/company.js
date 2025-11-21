// routes/company.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  registerCompany,
  getCompanyDashboard,
  inviteTeamMember,
  updateTeamMemberRole,
  removeTeamMember,
  getCompanyGigs
} = require('../controllers/companyController');

// Company middleware - user must belong to a company
const companyProtect = [protect, (req, res, next) => {
  if (!req.user.company) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Company membership required.'
    });
  }
  next();
}];

// Company admin middleware - user must be company admin/owner
const companyAdminProtect = [companyProtect, (req, res, next) => {
  if (!['owner', 'admin'].includes(req.user.companyRole)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Company admin privileges required.'
    });
  }
  next();
}];

// Company registration
router.post('/register', registerCompany);

// Company dashboard and management
router.get('/dashboard', companyProtect, getCompanyDashboard);
router.get('/gigs', companyProtect, getCompanyGigs);

// Team management
router.post('/team/invite', companyAdminProtect, inviteTeamMember);
router.put('/team/:userId/role', companyAdminProtect, updateTeamMemberRole);
router.delete('/team/:userId', companyAdminProtect, removeTeamMember);

// 💰 PHASE 2: Advanced routes (commented)
/*
router.post('/gigs/bulk', companyProtect, createBulkGigs);
router.get('/analytics', companyProtect, getCompanyAnalytics);
*/

module.exports = router;