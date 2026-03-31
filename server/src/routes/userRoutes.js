import express from 'express';
import { userController } from '../controllers/userController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, userController.getAllUsers);
router.get('/:id', protect, adminOnly, userController.getUserById);
router.put('/:id/role', protect, adminOnly, userController.updateUserRole);
router.delete('/:id', protect, adminOnly, userController.deleteUser);
router.put('/password/update', protect, userController.updatePassword);

export default router;