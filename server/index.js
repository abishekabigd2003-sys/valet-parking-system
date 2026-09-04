const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const validateEnv = require('./config/validateEnv');
validateEnv();

const app = express();

const server = http.createServer(app);
const rawClientUrl = process.env.CLIENT_URL || '';
const clientUrl = rawClientUrl.trim().replace(/\/$/, '');

const allowedOrigins = clientUrl 
  ? [clientUrl, 'http://localhost:5173', 'http://localhost:5000', 'https://valet-parking-system-qtci.onrender.com'] 
  : '*';

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('New real-time client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Security & Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins === '*') return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Fallback: if it's a Render domain, just allow it
      if (origin && origin.endsWith('onrender.com')) {
        callback(null, true);
      } else {
        callback(null, false); // Block quietly instead of crashing
      }
    }
  },
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow Firebase iframe and external assets without complex configuration
}));
app.use(express.json());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(compression());

// Fast health check endpoint (bypasses rate limit)
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  
  res.status(200).json({
    status: 'ok',
    database: dbStatusMap[dbState] || 'unknown',
    databaseConnected: dbState === 1,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
app.get('/ping', (req, res) => res.status(200).send('pong'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' || process.env.E2E_TEST === 'true' ? 10000 : 1000,
  skip: () => process.env.NODE_ENV === 'test' || process.env.E2E_TEST === 'true',
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Connect Database
connectDB();

// Removed Basic Route to allow React app to handle '/'

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/parking', require('./routes/parkingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Serve Frontend in Production with Caching Headers
if (process.env.NODE_ENV === 'production' || true) {
  const clientBuildPath = path.join(__dirname, '../Client/dist');
  app.use(express.static(clientBuildPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      // Hashed static files in dist/assets can be cached immutably for 1 year
      if (filePath.includes(path.join('dist', 'assets'))) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another running process.`);
    console.error(`👉 Tip: Stop the existing process or run: taskkill /F /IM node.exe\n`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log('\n=========================================');
  console.log(`🚀 Server successfully started on port ${PORT}`);
  console.log('=========================================\n');
});
