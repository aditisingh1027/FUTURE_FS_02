const mongoose = require('mongoose');
const Activity = require('../server/models/Activity');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clientpilot');
    const acts = await Activity.find().sort({ createdAt: -1 }).limit(10).populate('performedBy', 'name email').populate('lead', 'name');
    console.log('Recent activities:');
    console.log(JSON.stringify(acts, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();