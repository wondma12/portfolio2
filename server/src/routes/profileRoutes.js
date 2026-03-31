import express from 'express';
import { profileController } from '../controllers/profileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, profileController.getProfile);
router.put('/', protect, profileController.updateProfile);

export default router;