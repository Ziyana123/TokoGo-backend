const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, tags, stock, image } = req.body;
    console.log(req.body);

    const product = await Product.create({
      name,
      description,
      category,
      price,
      tags,
      stock,
      image,
      createdBy: req.userId
    });
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

    const products = await Product.find(query)
      .populate('category')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));
    const totalCount = await Product.countDocuments(query);


    res.json({
      total: totalCount,
      page: parseInt(page),
      pages: Math.ceil(totalCount / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
