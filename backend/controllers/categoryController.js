import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc   Get all categories
// @route  GET /api/categories
// @access Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });

    // Dynamically calculate and refresh product counts
    const updatedCategories = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: { $regex: new RegExp(`^${cat.name}$`, 'i') }
        });
        return {
          ...cat.toObject(),
          itemCount: count
        };
      })
    );

    res.json(updatedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Create a category
// @route  POST /api/categories
// @access Private/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    if (!name || !image) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      image,
      description: description || ''
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Update a category
// @route  PUT /api/categories/:id
// @access Private/Admin
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = req.body.name || category.name;
    if (req.body.name) {
      category.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    category.image = req.body.image || category.image;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc   Delete a category
// @route  DELETE /api/categories/:id
// @access Private/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
