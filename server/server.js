const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parser
app.use(express.json());

// Rate limiting configuration
// Auth routes: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased from 5 to 100 for better dev experience
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// General routes: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', generalLimiter);

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1', applicationRoutes);
app.use('/api/v1/saved', savedJobRoutes);
app.use('/api/v1/admin', adminRoutes);

const port = config.port || 5000;
app.listen(port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${port}`);
});

module.exports = app;
