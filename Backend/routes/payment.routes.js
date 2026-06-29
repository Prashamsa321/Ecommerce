import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { initiateKhaltiPayment, verifyKhaltiPayment } from '../controllers/payment.controller.js'

const router = express.Router()

router.post('/khalti/initiate', protect, initiateKhaltiPayment)
router.post('/khalti/verify', protect, verifyKhaltiPayment)

export default router
