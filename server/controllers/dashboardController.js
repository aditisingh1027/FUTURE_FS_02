const Lead = require('../models/Lead');
const mongoose = require('mongoose');

// Build match filter: sales users only see their assigned leads
const getRoleFilter = (user) => {
  if (user.role === 'sales') {
    return { assignedTo: new mongoose.Types.ObjectId(user.id) };
  }
  return {};
};

// @desc    Get dashboard stats cards
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const matchFilter = getRoleFilter(req.user);

    const stats = await Lead.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          newLeads: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contactedLeads: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          convertedLeads: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalLeads: 1,
          newLeads: 1,
          contactedLeads: 1,
          convertedLeads: 1,
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

    const result = stats[0] || {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
    };

    result.conversionRate = Math.round(result.conversionRate * 10) / 10;

    res.status(200).json({ success: true, stats: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chart data (pipeline stage + source breakdown)
// @route   GET /api/dashboard/charts
// @access  Private
const getDashboardCharts = async (req, res, next) => {
  try {
    const matchFilter = getRoleFilter(req.user);

    const [byStatus, bySource] = await Promise.all([
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, status: '$_id', count: 1 } },
        { $sort: { status: 1 } },
      ]),
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $project: { _id: 0, source: '$_id', count: 1 } },
        { $sort: { source: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      charts: {
        byStatus: byStatus || [],
        bySource: bySource || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get follow-up tracking data
// @route   GET /api/dashboard/followups
// @access  Private
const getFollowUps = async (req, res, next) => {
  try {
    const roleFilter = getRoleFilter(req.user);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const baseFilter = { ...roleFilter, followUpDate: { $ne: null } };
    const upcomingFilter = { ...roleFilter, followUpDate: { $gte: today } };
    const overdueFilter = { ...roleFilter, followUpDate: { $lt: today } };

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
        nextDue: upcoming[0] || null,
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
