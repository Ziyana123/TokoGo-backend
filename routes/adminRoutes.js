const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// Admin-only protected routes
router.get('/dashboard-stats', authMiddleware, isAdmin, adminController.getDashboardStats);
router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', authMiddleware, isAdmin, adminController.deleteUser);
router.put('/users/block/:id',authMiddleware, isAdmin, adminController.toggleBlockUser);
router.post('/register', adminController.registerAdmin);

module.exports = router;
