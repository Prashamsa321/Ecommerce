import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import cartRoutes from './routes/cart.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js';
import contactRoutes from './routes/contact.routes.js';
import otpRoutes from './routes/otp.routes.js';
import passwordRoutes from './routes/password.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { verifyEmailConfig } from './services/emailService.js';




dotenv.config()

const app = express()

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes); 
app.use('/api/contact', contactRoutes)
app.use('/api/otp', otpRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err)
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: err.message
  })
})

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test')
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

connectDB()

verifyEmailConfig()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

