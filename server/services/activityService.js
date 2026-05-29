const Activity = require('../models/Activity');

/**
 * Log a new activity for audit trail or timeline
 * @param {string} leadId - ID of the lead
 * @param {string} userId - ID of the user performing action
 * @param {string} type - 'note', 'email', 'call', 'meeting', 'status_change', 'creation'
 * @param {string} description - Summary of action
 */
const logActivity = async (leadId, userId, type, description) => {
  try {
    const activity = await Activity.create({
      lead: leadId,
      performedBy: userId,
      type,
      description,
    });
    return activity;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  logActivity,
};
