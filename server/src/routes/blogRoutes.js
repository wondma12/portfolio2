import express from 'express';
import { blogController } from '../controllers/blogController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', blogController.getAll);
router.get('/slug/:slug', blogController.getBySlug);
router.get('/:id', blogController.getOne);
router.post('/', protect, adminOnly, blogController.create);
router.put('/:id', protect, adminOnly, blogController.update);
router.delete('/:id', protect, adminOnly, blogController.delete);

export default router;