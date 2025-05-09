const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: String,
  address: String,
  preferences: [String],
  travelHistory: [String],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
