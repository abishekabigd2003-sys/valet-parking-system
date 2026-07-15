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
const allowedOrigins = process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173'] : '*';

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
  origin: allowedOrigins
}));
app.use(helmet({
  contentSecurityPolicy: false, // Disabled to allow Firebase iframe and external assets without complex configuration
}));
app.use(express.json());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Connect Database
connectDB();

// Basic Route
app.get('/', (req, res) => {
  res.send('Valet Parking System API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/parking', require('./routes/parkingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production' || true) {
  const clientBuildPath = path.join(__dirname, '../Client/dist');
  app.use(express.static(clientBuildPath));

  app.get(/(.*)/, (req, res) => {
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

server.listen(PORT, () => {
  console.log('\n=========================================');
  console.log(`🚀 Server successfully started on port ${PORT}`);
  console.log('=========================================\n');
});
