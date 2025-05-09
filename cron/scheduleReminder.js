const cron = require('node-cron');
const Order = require('../models/Order');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

// Only connect if this script is standalone (optional, for safety)
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Mongo connected for CRON job'))
    .catch(err => console.log(err));
}

// 🕘 CRON job runs at 9 AM daily
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Scheduled Delivery Reminder Running...');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);

  try {
    const orders = await Order.find({
      deliveryDate: { $gte: tomorrow, $lt: nextDay }
    }).populate('user');

    orders.forEach(order => {
      const user = order.user;
      const deliveryTime = new Date(order.deliveryDate).toLocaleString();
      console.log(`📬 Reminder: Send email to ${user.email} - Delivery scheduled for ${deliveryTime}`);
      
      // Optional: integrate nodemailer, twilio, or push notification here
    });
  } catch (error) {
    console.error('❌ Error in scheduled reminder:', error.message);
  }
});
