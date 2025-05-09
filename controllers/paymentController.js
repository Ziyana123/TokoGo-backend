const Stripe = require('stripe');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const calculateTotal = require('../utils/calculateTotal');

const processPayment = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

    const { token, amount, items, address, deliveryDate, deliveryType } = req.body;

    console.log('🧾 Payment Request:', { token, amount, address, items });

    let totalAmount;
    try {
      totalAmount = await calculateTotal(items);
      console.log('Recalculated Total Amount:', totalAmount);
    } catch (err) {
      console.error(' Error during calculateTotal:', err.message);
      return res.status(400).json({ success: false, message: 'Invalid products in cart' });
    }

    if (Math.round(amount * 100) !== Math.round(totalAmount * 100)) {
      return res.status(400).json({ success: false, message: 'Amount mismatch' });
    }

    const charge = await stripe.charges.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      source: token,
      description: 'Order Payment',
    });

    if (charge.status !== 'succeeded') {
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }

    const order = new Order({
      userId: req.user._id,
      items: items.map(item => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
      deliveryDate,
      deliveryType,
      paymentMethod: 'stripe',
      paymentStatus: 'Paid',
      stripeChargeId: charge.id,
    });

    await order.save();
    console.log('Order saved');

    const payment = new Payment({
      user: req.user._id,
      order: order._id,
      amount: totalAmount,
      paymentMethod: 'stripe',
      stripeChargeId: charge.id,
      status: charge.status,
    });

    await payment.save();
    console.log('Payment saved');

    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
      console.log('🧹 Cart cleared');
    }

    res.json({ success: true, charge, orderId: order._id });

  } catch (err) {
    console.error('Stripe Payment Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { processPayment };
