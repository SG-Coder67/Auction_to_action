const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController'); // Assuming you create this
const { protectAdmin } = require('../middleware/authMiddleware');

// --- AUTH ---
router.post('/register', authController.registerAdmin);
router.post('/login', authController.loginAdmin);

// --- ADMIN CRUD ---
router.get('/admins', protectAdmin, adminController.getAllAdmins);
router.post('/admins', protectAdmin, adminController.addAdmin);
router.put('/admins/:id', protectAdmin, adminController.updateAdmin);
router.delete('/admins/:id', protectAdmin, adminController.deleteAdmin);

// --- TEAM CRUD ---
router.get('/teams', protectAdmin, adminController.getAllTeams);
router.post('/teams', protectAdmin, adminController.addTeam);
router.put('/teams/:id', protectAdmin, adminController.updateTeam);
router.delete('/teams/:id', protectAdmin, adminController.deleteTeam);

// --- GAME ACTIONS ---
router.post('/award-bid', protectAdmin, adminController.awardBid);
router.post('/execute-trade', protectAdmin, adminController.executeTrade);

// --- HISTORY GETTERS ---
router.get('/transactions', protectAdmin, adminController.getTransactionHistory);
router.get('/trades', protectAdmin, adminController.getTradeHistory);

module.exports = router;