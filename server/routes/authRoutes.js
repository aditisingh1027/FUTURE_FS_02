const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validationMiddleware');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['sales', 'manager', 'admin']).withMessage('Invalid role selected'),
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
