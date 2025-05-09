const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// User
router.post('/', auth, orderController.placeOrder);
router.get('/my', auth, orderController.getUserOrders);

// Admin
router.get('/', auth, isAdmin, orderController.getAllOrders);
router.put('/:id/status', auth, isAdmin, orderController.updateOrderStatus);

module.exports = router;
