import express from 'express';
import { contactController } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', contactController.sendMessage);

// Admin only routes
router.get('/', protect, adminOnly, contactController.getAllMessages);
router.get('/:id', protect, adminOnly, contactController.getMessageById);
router.put('/:id/read', protect, adminOnly, contactController.markAsRead); // This line is important
router.put('/:id/reply', protect, adminOnly, contactController.markAsReplied);
router.delete('/:id', protect, adminOnly, contactController.deleteMessage);

export default router;