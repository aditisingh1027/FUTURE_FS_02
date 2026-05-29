const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['note', 'email', 'call', 'meeting', 'status_change', 'creation', 'deletion'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an activity description'],
    },
  },
  {
    timestamps: true, // will automatically add createdAt and updatedAt
  }
);

module.exports = mongoose.model('Activity', activitySchema);
