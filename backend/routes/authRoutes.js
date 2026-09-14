import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.post('/wishlist/toggle', protect, toggleWishlist);

export default router;
