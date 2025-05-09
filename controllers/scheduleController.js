const Schedule = require('../models/Schedule');
const Product = require('../models/Product');

// Create a scheduled delivery
exports.createSchedule = async (req, res) => {
  try {
    const { items, deliveryAddress, scheduledDate } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const schedule = new Schedule({
      userId: req.user._id,
      items,
      deliveryAddress,
      scheduledDate
    });

    await schedule.save();
    console.log("Saved schedule:", schedule);
    res.status(201).json({ message: 'Scheduled delivery created', schedule });
  } catch (error) {
    console.error("Schedule Creation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all schedules for a user
exports.getMySchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user._id }).populate('items.productId');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all scheduled deliveries
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({}).populate('userId', 'name email').populate('items.productId', 'name price');
    res.json(schedules);
  } catch (error) {
    console.error("Admin Schedule Fetch Error:", err);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update schedule status
exports.updateScheduleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.productId');
    res.json({ message: 'Schedule status updated', updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a scheduled delivery (user)
exports.cancelSchedule = async (req, res) => {
  try {

    console.log("User:", req.user); 
    console.log("Schedule ID:", req.params.id);
    // Find schedule by ID and user
    const schedule = await Schedule.findOne({ _id: req.params.id, userId: req.user._id });

    // If schedule is not found, return 404
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    // Check if the schedule is already canceled
    if (schedule.status === "Cancelled") {
      return res.status(400).json({ message: "Schedule is already canceled" });
    }

    // Ensure only "Scheduled" deliveries can be canceled
    if (schedule.status !== "Scheduled") {
      return res.status(400).json({ message: "Only 'Scheduled' deliveries can be canceled" });
    }

    // Cancel the schedule
    schedule.status = "Cancelled";
    await schedule.save();

    // Return success response
    res.status(200).json({ message: "Schedule canceled successfully" });
  } catch (error) {
    console.error("Cancel schedule error:", error);
    res.status(500).json({ message: error.message });  
  }
};


exports.deleteSchedule = async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ message: "Schedule deleted" });
};
