const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- AUTH ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await AdminUser.findOne({ username });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists.' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new AdminUser({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin user created successfully.' });
    } catch (error) {
        console.error("ERROR CREATING ADMIN:", error); 
        res.status(500).json({ message: 'Server error while creating admin.' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await AdminUser.findOne({ username });
        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: '8h' });
            res.json({ message: 'Admin login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("ERROR LOGGING IN ADMIN:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

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
router.post('/teams/update', protectAdmin, adminController.updateTeamGeneric);

// --- GAME ACTIONS ---
router.post('/award-bid', protectAdmin, adminController.awardBid);
router.post('/execute-trade', protectAdmin, adminController.executeTrade);

// --- ROUND MANAGEMENT ---
router.get('/round', protectAdmin, adminController.getCurrentRound);
router.post('/round', protectAdmin, adminController.updateRound);

// --- HISTORY GETTERS ---
router.get('/transactions', protectAdmin, adminController.getTransactionHistory);
router.get('/trades', protectAdmin, adminController.getTradeHistory);

module.exports = router;