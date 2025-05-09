

const Cart = require('../models/Cart');
const Product = require('../models/Product');

const formatCartWithProductDetails = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart) {
    console.log('Cart not found for user:', userId);
    return [];
  }

  return cart.items.map(item => ({
    _id: item.productId._id,
    name: item.productId.name,
    image: item.productId.image,
    price: item.productId.price,
    quantity: item.quantity,
  }));
};


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};




exports.getCart = async (req, res) => {
  try {
    const items = await formatCartWithProductDetails(req.user?._id);

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) item.quantity = quantity;

    await cart.save();
    const enrichedItems = await formatCartWithProductDetails(req.user._id);
    res.json({ message: 'Cart updated', items: enrichedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    const enrichedItems = await formatCartWithProductDetails(req.user._id);
    res.json({ message: 'Item removed', items: enrichedItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
