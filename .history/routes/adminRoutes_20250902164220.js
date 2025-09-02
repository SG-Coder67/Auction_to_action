const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser'); // Make sure this path is correct
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// --- Admin Authentication Routes ---

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }
        const existingAdmin = await AdminUser.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new AdminUser({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin user created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating admin.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await AdminUser.findOne({ username });

        if (admin && (await bcrypt.compare(password, admin.password))) {
            const token = jwt.sign(
                { userId: admin._id, role: admin.role },
                process.env.ADMIN_JWT_SECRET, // Make sure you have ADMIN_JWT_SECRET in your .env file
                { expiresIn: '8h' }
            );
            res.json({ message: 'Admin login successful!', token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// --- Admin User Management Routes (CRUD) ---
// (Your existing code for this is correct)
router.get('/admins', protectAdmin, adminController.getAllAdmins);
// ... keep the rest of your routes ...