import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} from '../controllers/order.controller.js';

const router = express.Router();

// Protected routes (user must be logged in)
router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

// Admin only routes
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getOrderStats);
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus);
router.delete('/admin/:id', protect, adminOnly, deleteOrder);

export default router;