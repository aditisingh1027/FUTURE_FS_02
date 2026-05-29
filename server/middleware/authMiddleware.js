const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT token
const protect = async (req, res, next) => {
  let token;

  // Check cookies first, then fall back to Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized to access this route - No token found'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123456!');

    // Get user from the token and attach to req
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized - User not found'));
    }

    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Not authorized to access this route - Invalid or expired token'));
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource`));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
