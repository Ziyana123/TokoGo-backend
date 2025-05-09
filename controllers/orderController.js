const Order = require('../models/Order');
const Cart = require('../models/Cart');
const calculateTotal = require('../utils/calculateTotal');

// Place an order
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address, deliveryDate, deliveryType, paymentMethod } = req.body;

    console.log("🛎️ Received order body:", req.body);

    // Validate
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const allowedDeliveryTypes = ['standard', 'express'];
    const allowedPaymentMethods = ['cod', 'stripe'];

    if (!allowedDeliveryTypes.includes(deliveryType)) {
      return res.status(400).json({ message: 'Invalid delivery type' });
    }

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const totalAmount = await calculateTotal(items);
    console.log(" Total amount calculated:", totalAmount);

    const order = new Order({
      userId,
      items,
      totalAmount,
      address,
      deliveryDate: deliveryDate || null,
      deliveryType,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      status: 'processing'
    });

    await order.save();
    console.log(" Order saved successfully");

    // Clear cart
    try {
      const cart = await Cart.findOne({ userId });
      if (cart) {
        cart.items = [];
        await cart.save();
        console.log(" Cart cleared after order");
      }
    } catch (cartError) {
      console.error(" Error clearing cart:", cartError.message);
    }
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error(" Error placing order:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get orders of the logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.productId');
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
