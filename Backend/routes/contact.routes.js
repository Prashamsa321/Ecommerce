import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import {
  submitContact,
  getAllContacts,
  getContactById,
  replyToContact,
  deleteContact,
  getContactStats
} from '../controllers/contact.controller.js';

const router = express.Router();

// Public route - anyone can submit contact form
router.post('/', submitContact);

// Admin only routes
router.get('/', protect, adminOnly, getAllContacts);
router.get('/stats', protect, adminOnly, getContactStats);
router.get('/:id', protect, adminOnly, getContactById);
router.put('/:id/reply', protect, adminOnly, replyToContact);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;