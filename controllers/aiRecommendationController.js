const AIRecommendation = require('../models/AIRecommendation');
const Product = require('../models/Product');

exports.generateRecommendation = async (req, res) => {
  try {
    const { preferences, destination } = req.body;

    console.log('Received body:', req.body);
    if (!destination || !Array.isArray(preferences)) {
      return res.status(400).json({ error: 'Invalid input: destination and preferences required' });
    }

    const regexTags = preferences.map(tag => new RegExp(`^${tag}$`, 'i'));
    const products = await Product.find({
      tags: { $in: regexTags }
    }).limit(6);

    if (!products.length) {
      return res.status(404).json({ message: 'No matching recommendations found.' });
    }

    const recommendation = new AIRecommendation({
      userId: req.user._id,
      recommendedItems: products.map(p => p._id),
      reason: `Matched preferences: ${preferences.join(', ')}`
    });

    await recommendation.save();

    res.status(201).json({ message: 'Recommendation generated', recommendation, products });
  } catch (error) {
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
