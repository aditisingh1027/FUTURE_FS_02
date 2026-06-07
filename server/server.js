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

// Must be first: trust Render's reverse proxy
app.set('trust proxy', 1);

// CORS before helmet/rate-limiter so OPTIONS preflights always get correct headers
const allowedOrigins = [
  'https://future-fs-02-mocha-one.vercel.app',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

// Security middleware (helmet + rate limiter) after CORS
securityMiddleware(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Debug: list registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      routes.push(`${methods} ${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      const match = layer.regexp.toString().match(/^\/\^\\\/([^\\]+)/);
      const prefix = match ? '/' + match[1] : '';
      layer.handle.stack.forEach((r) => {
        if (r.route) {
          const methods = Object.keys(r.route.methods).join(',').toUpperCase();
          routes.push(`${methods} ${prefix}${r.route.path}`);
        }
      });
    }
  });
  res.json({ registeredRoutes: routes });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  }
});

process.on('unhandledRejection', (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Unhandled Rejection: ${err.message}`);
  }
  server.close(() => process.exit(1));
});
