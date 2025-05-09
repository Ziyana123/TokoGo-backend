const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

// @route POST /api/payment
router.post('/', authMiddleware, processPayment);

module.exports = router;
