import express from 'express';
import { skillController } from '../controllers/skillController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', skillController.getAll);
router.post('/', protect, adminOnly, skillController.create);
router.put('/:id', protect, adminOnly, skillController.update);
router.delete('/:id', protect, adminOnly, skillController.delete);

export default router;