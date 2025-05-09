const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'stripe'], required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  address: { type: String, required: true },
  deliveryDate: { type: Date },
  deliveryType: { type: String, enum: ['standard', 'express'], required: true },
  status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
  stripeChargeId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
