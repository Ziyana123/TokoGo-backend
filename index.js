const dotenv = require('dotenv');
dotenv.config(); 
const express = require('express');

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const travelPackRoutes = require('./routes/travelPackRoutes');
const aiRoutes = require('./routes/aiRecommendationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require("./routes/contactRoutes");
const cors = require('cors');


connectDB(); 

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/travelpack', travelPackRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);



require('./cron/scheduleReminder');


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
