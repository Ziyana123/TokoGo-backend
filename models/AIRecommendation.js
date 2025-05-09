const mongoose = require('mongoose');

const aiRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRecommendation', aiRecommendationSchema);
