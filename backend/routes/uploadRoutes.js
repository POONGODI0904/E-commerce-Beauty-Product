import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  // Normalize path with forward slashes for web URLs
  const normalizedPath = `/${req.file.path.replace(/\\/g, '/')}`;
  res.json({
    message: 'Image uploaded successfully',
    imageUrl: normalizedPath
  });
});

export default router;
