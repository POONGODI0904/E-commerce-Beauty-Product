import express from 'express';
import { getAdminStats, getUsers, toggleUserStatus } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

export default router;
