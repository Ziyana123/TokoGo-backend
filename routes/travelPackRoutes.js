const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const travelPackController = require('../controllers/travelPackController');

// Build a new smart pack
router.post('/build', authMiddleware, travelPackController.buildSmartPack);

// Get all smart packs for a user
router.get('/my-packs', authMiddleware, travelPackController.getMySmartPacks);

// Update a travel pack
router.put('/:id', authMiddleware, travelPackController.updateTravelPack);

// Delete a travel pack
router.delete('/:id', authMiddleware, travelPackController.deleteTravelPack);

router.get('/:id', authMiddleware, travelPackController.getTravelPackById);

module.exports = router;
