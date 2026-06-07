const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const securityMiddleware = require('./middleware/securityMiddleware');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();

// Trust Render's reverse proxy — must be first
app.set('trust proxy', 1);

// CORS must be before everything else (helmet, rate limiter)
// so preflight OPTIONS responses always carry the correct headers
const allowedOrigins = [
  'https://future-fs-02-mocha-one.vercel.app',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server calls (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle OPTIONS preflight before any other middleware can intercept it
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// Security middleware (helmet + rate limiter) runs after CORS
securityMiddleware(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Temporary debug endpoint — lists all registered route paths
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((layer) => {
    if (layer.route) {
      routes.push(`${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      const prefix = layer.regexp.source
        .replace('^\\\/','/')
        .replace('(?=\\/|$)','')
        .replace(/\\\/g, '/');
      layer.handle.stack.forEach((r) => {
        if (r.route) {
          routes.push(`${Object.keys(r.route.methods).join(',').toUpperCase()} ${prefix}${r.route.path}`);
        }
      });
    }
  });
  res.json({ registeredRoutes: routes });
});

// Register API Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Unhandled Rejection Error: ${err.message}`);
  }
  // Close server & exit process
  server.close(() => process.exit(1));
});
