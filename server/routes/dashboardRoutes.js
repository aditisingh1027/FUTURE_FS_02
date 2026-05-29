const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardCharts, getFollowUps } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getDashboardStats);
router.get('/charts', protect, getDashboardCharts);
router.get('/followups', protect, getFollowUps);

module.exports = router;
