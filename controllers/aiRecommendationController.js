
const AIRecommendation = require('../models/AIRecommendation');
const Product = require('../models/Product');
const SmartPack = require('../models/TravelPack');

exports.generateRecommendation = async (req, res) => {
  try {
    const travelPack = await TravelPack.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!travelPack || !Array.isArray(travelPack.preferences)) {
      return res.status(404).json({ error: 'No valid Smart Pack with preferences found.' });
    }

    const regexTags = travelPack.preferences.map(tag => new RegExp(`^${tag}$`, 'i'));
    
    const products = await Product.find({
      tags: { $in: regexTags }
    }).limit(6);

    if (!products.length) {
      return res.status(404).json({ message: 'No matching recommendations found.' });
    }

    const recommendation = await AIRecommendation.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        recommendedItems: products.map(p => p._id),
        reason: `Matched preferences: ${travelPack.preferences.join(', ')}`
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Recommendation generated', recommendation, products });
  } catch (error) {
    console.error('Recommendation generation failed:', error);
    res.status(500).json({ message: error.message });
  }
};




// Get user's recommendations
exports.getMyRecommendations = async (req, res) => {
  try {
    const recommendations = await AIRecommendation.find({ userId: req.user._id })
      .populate('recommendedItems');
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete recommendation
exports.deleteRecommendation = async (req, res) => {
  try {
    const deleted = await AIRecommendation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Recommendation not found' });

    res.json({ message: 'Recommendation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all AI recommendations
exports.getAllRecommendations = async (req, res) => {
  try {
    const recommendations = await AIRecommendation.find()
      .populate('userId', 'name email') // Optional: populate user info
      .populate('recommendedItems');     // Populate product details

    res.status(200).json({
      message: 'All AI recommendations fetched successfully',
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
