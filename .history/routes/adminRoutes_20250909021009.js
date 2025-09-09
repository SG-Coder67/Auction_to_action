// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController'); // We'll create this next
const { protectAdmin } = require('../middleware/authMiddleware');

// --- Auth ---
router.post('/register', authController.registerAdmin);
router.post('/login', authController.loginAdmin);

// --- Admin User Management ---
router.get('/admins', protectAdmin, adminController.getAllAdmins);
// Other admin CRUD routes were fine

// --- Team Management ---
router.get('/teams', protectAdmin, adminController.getAllTeams);
router.post('/teams', protectAdmin, adminController.addTeam);
router.put('/teams/:id', protectAdmin, adminController.updateTeam);
router.delete('/teams/:id', protectAdmin, adminController.deleteTeam);

// --- Game Management ---
router.post('/award-bid', protectAdmin, adminController.awardBid);
router.post('/execute-trade', protectAdmin, adminController.executeTrade);

// --- History ---
router.get('/bid-history', protectAdmin, adminController.getBidHistory);
router.get('/trade-history', protectAdmin, adminController.getTradeHistory);

module.exports = router;