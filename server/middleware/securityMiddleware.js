const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Environment-aware rate limiting
const isDevelopment = process.env.NODE_ENV !== 'production';
const maxRequests = isDevelopment ? 1000 : 100;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  // Required when running behind a reverse proxy (e.g. Render)
  keyGenerator: (req) => req.ip,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

const securityMiddleware = (app) => {
  app.use(helmet());
  app.use('/api', apiLimiter);
};

module.exports = securityMiddleware;
