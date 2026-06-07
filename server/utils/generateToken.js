const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User identifier
 * @returns {string} Token string
 */
const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey123456!';
  const expire = process.env.JWT_EXPIRE || '30d';

  // Sign Token
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: expire,
  });

  // Determine cookie lifespan (default 30 days)
  const cookieExpiry = 30 * 24 * 60 * 60 * 1000; 

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: cookieExpiry,
  };

  res.cookie('token', token, cookieOptions);

  return token;
};

module.exports = generateToken;
