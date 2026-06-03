const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const connectDB = require('./db');
const socketHolder = require('./socket');

const authRoutes = require('./routes/auth');
const complaintsRoutes = require('./routes/complaints');
const departmentsRoutes = require('./routes/departments');
const officersRoutes = require('./routes/officers');
const notificationsRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const locationRoutes = require('./routes/location');

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civiceye';
const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Enforce JWT_SECRET in production
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required. Set it before starting the server.');
  process.exit(1);
}

// Configure CORS with explicit origins
const corsOptions = {
  origin: CORS_ORIGIN.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/officers', officersRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/location', locationRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const server = http.createServer(app);

connectDB(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // setup socket.io
    const io = new Server(server, {
      cors: { origin: CORS_ORIGIN.split(',').map(o => o.trim()), credentials: true }
    });

    io.use((socket, next) => {
      const token = socket.handshake.query?.token || socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        return next();
      } catch (err) {
        return next(new Error('Invalid token'));
      }
    });

    io.on('connection', (socket) => {
      if (socket.userId) {
        socket.join(`user:${socket.userId}`);
      }
      if (socket.userRole === 'admin') {
        socket.join('admins');
      }
    });

    socketHolder.io = io;

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or configure a different PORT in backend/.env.`);
      } else {
        console.error('Server error', err);
      }
      process.exit(1);
    });

    server.listen(PORT, () => {
      console.log(`Civiceye backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
