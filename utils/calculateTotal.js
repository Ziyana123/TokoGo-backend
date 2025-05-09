const Product = require('../models/Product');

const calculateTotal = async (items) => {
  let totalAmount = 0;
  for (let item of items) {
    const productId = item.productId._id || item.productId;
    console.log('🔍 Fetching product for ID:', item.productId);
    const product = await Product.findById(item.productId);

    if (!product) {
      console.error(' Product not found for ID:', item.productId);
      throw new Error(`Product not found for ID: ${item.productId}`);
    }
    totalAmount += product.price * item.quantity;
  }
  return totalAmount;
};

module.exports = calculateTotal;
