const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const scheduleController = require('../controllers/scheduleController');

// User: Create a new scheduled delivery
router.post('/create', authMiddleware, scheduleController.createSchedule);

// User: Get own scheduled deliveries
router.get('/my-schedules', authMiddleware, scheduleController.getMySchedules);

router.put('/cancel/:id', authMiddleware, scheduleController.cancelSchedule);

// Admin: View all schedules
router.get('/admins/all', authMiddleware, isAdmin, scheduleController.getAllSchedules);

// Admin: Update delivery status
router.put('/admins/:id/status', authMiddleware, isAdmin, scheduleController.updateScheduleStatus);

router.delete('/admins/:id' , authMiddleware , isAdmin , scheduleController.deleteSchedule);
router.put('/admins/cancel/:id', authMiddleware, isAdmin, scheduleController.adminCancelSchedule);


module.exports = router;
