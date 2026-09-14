import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    default: 'ÉLORA BEAUTY'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    default: 10,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  images: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  ingredients: {
    type: String,
    default: 'Aqua, Rosa Damascena Flower Water, Niacinamide, Hyaluronic Acid, Botanical Extracts, Tocopherol (Vitamin E).'
  },
  benefits: [{
    type: String
  }],
  skinType: {
    type: String,
    default: 'All Skin Types'
  },
  usage: {
    type: String,
    default: 'Apply gently to clean skin morning and evening. Pat gently with fingertips until fully absorbed.'
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  bestseller: {
    type: Boolean,
    default: false,
    index: true
  },
  newArrival: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
