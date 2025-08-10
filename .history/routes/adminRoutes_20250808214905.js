const expressAdmin = require('express');
const bcryptAdmin = require('bcryptjs');
const jwtAdmin = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const adminRouter = expressAdmin.Router();

const protectAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authorized' });
    try {
        const decoded = jwtAdmin.verify(token, process.env.ADMIN_JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

adminRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await AdminUser.findOne({ username });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists.' });
        
        const hashedPassword = await bcryptAdmin.hash(password, 10);
        const admin = new AdminUser({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin user created.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

adminRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await AdminUser.findOne({ username });

    if (admin && (await bcryptAdmin.compare(password, admin.password))) {
      const token = jwtAdmin.sign({ userId: admin._id, role: admin.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: '8h' });
      res.json({ message: 'Admin login successful!', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

adminRouter.get('/dashboard', protectAdmin, (req, res) => {
    const dashboardData = {
      message: 'Welcome to the Admin Dashboard!',
      adminUserId: req.user.userId,
    };
    res.json(dashboardData);
});

module.exports = adminRouter;
