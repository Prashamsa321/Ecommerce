import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { 
  register, 
  login, 
  getMe,
  updateUserRole,
  deleteUser,
  updateProfile,
} from '../controllers/auth.controller.js';
import User from '../models/User.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

router.put('/updateprofile', protect, updateProfile); 

// Protected routes
router.get('/me', protect, getMe);



// Admin only routes
router.get('/users', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }
    
    const users = await User.find({}).select('-password');
    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', protect, updateUserRole);

// Delete user (admin only)
router.delete('/users/:id', protect, deleteUser);


export default router;