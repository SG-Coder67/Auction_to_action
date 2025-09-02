const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware'); // Assuming this is separated
const authController = require('../controllers/authController'); // Assuming login/register is separated

// --- Admin Authentication Routes ---
router.post('/register', authController.registerAdmin); // Best to move auth logic to its own controller
router.post('/login', authController.loginAdmin);

// --- NEW: Admin User Management Routes (CRUD) ---
router.get('/admins', protectAdmin, adminController.getAllAdmins);
router.post('/admins', protectAdmin, adminController.addAdmin);
router.put('/admins/:id', protectAdmin, adminController.updateAdmin);
router.delete('/admins/:id', protectAdmin, adminController.deleteAdmin);

// --- NEW: Team Data Route for Admin ---
router.get('/teams', protectAdmin, adminController.getAllTeams);

// --- Game Management Routes ---
router.post('/award-bid', protectAdmin, adminController.awardBid);
router.post('/execute-trade', protectAdmin, adminController.executeTrade);

// --- MODIFIED: Transaction routes now include update and delete ---
router.get('/transactions', protectAdmin, adminController.getFullTransactionHistory);
router.put('/transactions/:id', protectAdmin, adminController.updateTransaction);
router.delete('/transactions/:id', protectAdmin, adminController.deleteTransaction);

module.exports = router;