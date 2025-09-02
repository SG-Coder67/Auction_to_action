const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
// You should move the login/register logic to its own controller
// For now, let's assume it's handled elsewhere or add it here.

// --- Admin Authentication (keep as is) ---
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
console.error("ERROR CREATING ADMIN:", error);
module.exports = router;