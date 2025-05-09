const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // console.log("🔍 Mongo URI from .env:", process.env.MONGO_URI);  // Debug line
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
