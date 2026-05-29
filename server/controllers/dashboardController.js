const Lead = require('../models/Lead');
const mongoose = require('mongoose');

// @desc    Get dashboard analytics stats (Admin/Manager see global stats, Sales see assigned leads only)
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    let matchFilter = {};

    // Apply role-based scoping
    if (req.user.role === 'sales') {
      matchFilter.assignedTo = new mongoose.Types.ObjectId(req.user.id);
    }

    // Run MongoDB Aggregation Pipeline
    const stats = await Lead.aggregate([
      {
        $match: matchFilter,
      },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          newLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] },
          },
          contactedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] },
          },
          convertedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalLeads: 1,
          newLeads: 1,
          contactedLeads: 1,
          convertedLeads: 1,
          // Calculate conversion rate: (convertedLeads / totalLeads) * 100
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              { $multiply: [{ $divide: ['$convertedLeads', '$totalLeads'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    // Handle empty database case gracefully
    const responseStats = stats[0] || {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
    };

    // Round conversionRate to 1 decimal place
    responseStats.conversionRate = Math.round(responseStats.conversionRate * 10) / 10;

    res.status(200).json({
      success: true,
      stats: responseStats,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardCharts = async (req, res, next) => {
  try {
    let matchFilter = {};
    if (req.user.role === 'sales') {
      matchFilter.assignedTo = new mongoose.Types.ObjectId(req.user.id);
    }

    const statusAggregation = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
      { $sort: { status: 1 } },
    ]);

    const sourceAggregation = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          source: '$_id',
          count: 1,
        },
      },
      { $sort: { source: 1 } },
    ]);

    res.status(200).json({
      success: true,
      charts: {
        byStatus: statusAggregation,
        bySource: sourceAggregation,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFollowUps = async (req, res, next) => {
  try {
    let matchFilter = { followUpDate: { $ne: null } };
    if (req.user.role === 'sales') {
      matchFilter.assignedTo = new mongoose.Types.ObjectId(req.user.id);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingFilter = {
      ...matchFilter,
      followUpDate: { $gte: today },
    };
    const overdueFilter = {
      ...matchFilter,
      followUpDate: { $lt: today },
    };

    const [upcomingCount, overdueCount, upcoming, overdue] = await Promise.all([
      Lead.countDocuments(upcomingFilter),
      Lead.countDocuments(overdueFilter),
      Lead.find(upcomingFilter)
        .sort({ followUpDate: 1 })
        .limit(5)
        .select('name email followUpDate status assignedTo')
        .populate('assignedTo', 'name email role'),
      Lead.find(overdueFilter)
        .sort({ followUpDate: -1 })
        .limit(5)
        .select('name email followUpDate status assignedTo')
        .populate('assignedTo', 'name email role'),
    ]);

    res.status(200).json({
      success: true,
      followUps: {
        upcomingCount,
        overdueCount,
        upcoming,
        overdue,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getDashboardCharts,
  getFollowUps,
};
