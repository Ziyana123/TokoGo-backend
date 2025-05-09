const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const aiRecommendationController = require('../controllers/aiRecommendationController');

// Generate AI recommendation
router.post('/generate', authMiddleware, aiRecommendationController.generateRecommendation);

// Get user’s recommendations
router.get('/my-recommendations', authMiddleware, aiRecommendationController.getMyRecommendations);

// Admin: Delete a recommendation
router.delete('/:id', authMiddleware, isAdmin, aiRecommendationController.deleteRecommendation);

router.get('/all', authMiddleware, isAdmin, aiRecommendationController.getAllRecommendations);


module.exports = router;
