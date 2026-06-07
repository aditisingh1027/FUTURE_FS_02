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

// Connect to MongoDB
connectDB();

const app = express();

// Trust Render's reverse proxy (required for express-rate-limit and secure cookies)
app.set('trust proxy', 1);

securityMiddleware(app);

// Standard middlewares
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
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
