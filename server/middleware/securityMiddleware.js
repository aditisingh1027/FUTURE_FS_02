const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
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
