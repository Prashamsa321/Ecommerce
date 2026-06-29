import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { 
  register, 
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  updateUserRole,
  deleteUser
} from '../controllers/auth.controller.js';
import User from '../models/user.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);
router.put('/change-password', protect, changePassword);  // Change password endpoint

// Admin only routes
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;