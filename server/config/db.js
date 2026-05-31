const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clientpilot');
    if (process.env.NODE_ENV !== 'production') {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Database connection error: ${error.message}`);
    }
    process.exit(1); // Exit process with failure
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('MongoDB disconnected. Attempting to reconnect...');
  }
});

mongoose.connection.on('error', (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`MongoDB connection event error: ${err.message}`);
  }
});

module.exports = connectDB;
