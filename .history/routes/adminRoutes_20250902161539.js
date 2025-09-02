const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
// You should move the login/register logic to its own controller
// For now, let's assume it's handled elsewhere or add it here.

// --- Admin Authentication (keep as is) ---
// router.post('/register', ...);
// router.post('/login', ...);

// --- Admin User Management Routes (CRUD) ---
router.get('/admins', protectAdmin, adminController.getAllAdmins);
router.post('/admins', protectAdmin, adminController.addAdmin);
router.put('/admins/:id', protectAdmin, adminController.updateAdmin);
router.delete('/admins/:id', protectAdmin, adminController.deleteAdmin);

// --- Team Data Route for Admin ---
router.get('/teams', protectAdmin, adminController.getAllTeams);
// Add PUT, POST, DELETE for teams here if needed

// --- Game Management Routes ---
router.post('/award-bid', protectAdmin, adminController.awardBid);
router.post('/execute-trade', protectAdmin, adminController.executeTrade);

// --- Transaction History Route ---
router.get('/transactions', protectAdmin, adminController.getFullTransactionHistory);
router.put('/transactions/:id', protectAdmin, adminController.updateTransaction);
router.delete('/transactions/:id', protectAdmin, adminController.deleteTransaction);

module.exports = router;