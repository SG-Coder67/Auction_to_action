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

// Set up Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Or your specific frontend URL
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

// Connect your route files
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Auction to Action API!');
});

// --- Merged from teammate's index.js ---
// Handle new socket connections and room joining
io.on('connection', (socket) => {
  console.log('✅ A user connected via WebSocket:', socket.id);
  
  socket.on('joinTeamRoom', (teamNumber) => {
    socket.join(`team-${teamNumber}`);
    console.log(`Socket ${socket.id} joined room for Team ${teamNumber}`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});