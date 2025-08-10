require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import both route files
const adminRoutes = require('./routes/adminRoutes');
const participantRoutes = require('./routes/participantRoutes');

const app = express();

// --- SETUP MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('Database connection error:', err));

// --- CONNECT ROUTES ---
// For any URL that starts with '/api/admin', use the adminRoutes.
app.use('/api/admin', adminRoutes);

// For any URL that starts with '/api/participant', use the participantRoutes.
app.use('/api/participant', participantRoutes);


// --- WELCOME ROUTE ---
app.get('/', (req, res) => {
  res.send('Welcome to the Auction to Action API! The server is running correctly.');
});

// --- START THE SERVER ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
