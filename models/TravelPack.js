const mongoose = require('mongoose');

const travelPackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  travelDates: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  preferences: [String],
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  totalEstimatedCost: Number
}, { timestamps: true });

module.exports = mongoose.model('TravelPack', travelPackSchema);
