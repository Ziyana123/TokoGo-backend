const Product = require('../models/Product');
const TravelPack = require('../models/TravelPack');
const AIRecommendation = require('../models/AIRecommendation');

exports.buildSmartPack = async (req, res) => {
  try {
    const { destination, travelDates, preferences } = req.body;

    // Find matching products by tags/preferences
    const matchedProducts = await Product.find({
      tags: { $in: preferences },
      stock: { $gt: 0 }
    }).limit(10);

    if (!matchedProducts.length) {
      return res.status(404).json({ message: "No matching products found for your preferences." });
    }

    // Calculate estimated cost
    const totalEstimatedCost = matchedProducts.reduce((sum, p) => sum + p.price, 0);

    // Create smart pack
    const travelPack = new TravelPack({
      userId: req.user._id,
      destination,
      travelDates,
      preferences,
      items: matchedProducts.map(p => p._id),
      totalEstimatedCost
    });

    await travelPack.save();

    if (matchedProducts.length) {
      const recommendation = new AIRecommendation({
        userId: req.user._id,
        recommendedItems: matchedProducts.map(p => p._id),
        reason: `Matched preferences: ${preferences.join(', ')}`
      });

      await recommendation.save();
    }

    res.status(201).json({
      message: "Smart Travel Pack created successfully",
      travelPack,
      products: matchedProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all smart packs for user
exports.getMySmartPacks = async (req, res) => {
  try {
    const travelPack = await TravelPack.find({ userId: req.user._id }).populate('items');
    res.json(travelPack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateTravelPack = async (req, res) => {
  try {
    const packId = req.params.id;
    const { destination, travelDates, preferences } = req.body;

    const updatedPack = await TravelPack.findOneAndUpdate(
      { _id: packId, userId: req.user._id },
      { destination, travelDates, preferences },
      { new: true }
    ).populate('items');

    if (!updatedPack) {
      return res.status(404).json({ message: 'Travel pack not found' });
    }

    res.json({ message: 'Travel pack updated', travelPack: updatedPack });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteTravelPack = async (req, res) => {
  try {
    const packId = req.params.id;

    const deleted = await TravelPack.findOneAndDelete({ _id: packId, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Travel pack not found' });
    }

    res.json({ message: 'Travel pack deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get a single travel pack by ID
exports.getTravelPackById = async (req, res) => {
  try {
    const packId = req.params.id;

    const travelPack = await TravelPack.findOne({
      _id: packId,
      userId: req.user._id
    }).populate('items');

    if (!travelPack) {
      return res.status(404).json({ message: 'Travel pack not found' });
    }

    res.json(travelPack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};