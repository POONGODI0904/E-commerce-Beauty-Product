import Product from '../models/Product.js';

// @desc   Fetch all products with advanced filtering, search, sorting, pagination
// @route  GET /api/products
// @access Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const queryObj = {};

    // Search keyword
    if (req.query.keyword) {
      queryObj.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { category: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      queryObj.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    // Brand filter
    if (req.query.brand && req.query.brand !== 'All') {
      queryObj.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.price = {};
      if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
    }

    // Rating filter
    if (req.query.rating) {
      queryObj.rating = { $gte: Number(req.query.rating) };
    }

    // In Stock filter
    if (req.query.inStock === 'true') {
      queryObj.stock = { $gt: 0 };
    }

    // Discount filter
    if (req.query.hasDiscount === 'true') {
      queryObj.discount = { $gt: 0 };
    }

    // Featured / Bestseller / New arrival filters
    if (req.query.featured === 'true') queryObj.featured = true;
    if (req.query.bestseller === 'true') queryObj.bestseller = true;
    if (req.query.newArrival === 'true') queryObj.newArrival = true;

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    else if (req.query.sort === 'price-desc') sort = { price: -1 };
    else if (req.query.sort === 'rating') sort = { rating: -1 };
    else if (req.query.sort === 'newest') sort = { createdAt: -1 };
    else if (req.query.sort === 'popular') sort = { numReviews: -1, rating: -1 };

    const count = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Also get all distinct brands and categories for filter menus
    const brands = await Product.distinct('brand');
    const categories = await Product.distinct('category');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      brands,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Fetch live search suggestions
// @route  GET /api/products/suggestions
// @access Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const suggestions = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name category brand price images discount')
      .limit(6);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Fetch single product by ID
// @route  GET /api/products/:id
// @access Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Find related products in same category
      const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(4);

      res.json({ product, related });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a product
// @route  POST /api/products
// @access Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      discount,
      stock,
      sku,
      images,
      ingredients,
      benefits,
      skinType,
      usage,
      featured,
      bestseller,
      newArrival
    } = req.body;

    const product = new Product({
      name,
      brand: brand || 'ÉLORA BEAUTY',
      category,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock) || 0,
      sku: sku || `ELR-${Date.now().toString().slice(-6)}`,
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'],
      ingredients,
      benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split(',').map(b => b.trim()) : []),
      skinType: skinType || 'All Skin Types',
      usage,
      featured: Boolean(featured),
      bestseller: Boolean(bestseller),
      newArrival: Boolean(newArrival),
      rating: 5.0,
      numReviews: 1
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update a product
// @route  PUT /api/products/:id
// @access Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const fields = [
      'name', 'brand', 'category', 'description', 'price', 'discount',
      'stock', 'sku', 'images', 'ingredients', 'benefits', 'skinType',
      'usage', 'featured', 'bestseller', 'newArrival'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'benefits' && typeof req.body[field] === 'string') {
          product[field] = req.body[field].split(',').map(b => b.trim());
        } else {
          product[field] = req.body[field];
        }
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product successfully removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
