require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import the route file
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- SETUP MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('Database connection error:', err));

// --- CONNECT ROUTES ---
// Tell the server: "For any URL that starts with '/api/admin',
// use the rules defined in the adminRoutes.js file."
app.use('/api/admin', adminRoutes);

// You will add more routes here later, for example:
// app.use('/api/teams', teamRoutes);


// --- START THE SERVER ---
// --- ADD A WELCOME ROUTE FOR THE ROOT URL ---
app.get('/', (req, res) => {
  res.send('Welcome to the Auction to Action API! The server is running correctly.');
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
