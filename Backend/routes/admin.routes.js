import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { getAdminReports } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/reports', protect, adminOnly, getAdminReports);

export default router;
