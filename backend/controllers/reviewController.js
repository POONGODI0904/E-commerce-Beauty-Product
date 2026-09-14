import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc   Create new review
// @route  POST /api/reviews
// @access Private
export const createProductReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      // Allow updating existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
    } else {
      await Review.create({
        product: productId,
        user: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        rating: Number(rating),
        comment
      });
    }

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = Number(
      (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
    );
    await product.save();

    res.status(201).json({ message: 'Review successfully submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get product reviews
// @route  GET /api/reviews/product/:productId
// @access Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete review
// @route  DELETE /api/reviews/:id
// @access Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (product) {
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0
        ? Number((reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1))
        : 5.0;
      await product.save();
    }

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
