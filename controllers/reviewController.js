const Review = require('../models/Review');
const Product = require('../models/Product');

// Create Review
exports.createReview = async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { rating, comment, userId } = req.body;
    const { productId } = req.params;

    if (!rating || !comment || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await Review.findOne({ userId: req.user._id, productId });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product.' });

    const review = await Review.create({
      userId: req.user._id,
      productId,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get Reviews for a Product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json({reviews});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });
    if (!review) return res.status(403).json({ message: 'Unauthorized or review not found' });

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    res.json({ message: 'Review updated', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId:req.user._id });
    if (!review) return res.status(403).json({ message: 'Unauthorized or review not found' });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
