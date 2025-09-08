require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const adminRoutes = require('./routes/adminRoutes');
const teamRoutes = require('./routes/teamRoutes');

const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS for your React app
const io = new Server(server, {
  cors: {
    origin: "*", // For testing; restrict this to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Middleware to make 'io' available to all route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Connect your existing route files
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);

// Root route for checking if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Auction to Action API! The server is running correctly.');
});

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('✅ A user connected via WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
// Listen on the http server, not the app
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});