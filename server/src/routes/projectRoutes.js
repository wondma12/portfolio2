import express from 'express';
import { projectController } from '../controllers/projectController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Make sure all controller methods exist
router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);
router.post('/', protect, adminOnly, projectController.create);
router.put('/:id', protect, adminOnly, projectController.update);
router.delete('/:id', protect, adminOnly, projectController.delete);

export default router;