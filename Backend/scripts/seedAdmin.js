import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../models/user.js'

dotenv.config()

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin'
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@merogadget.com').toLowerCase().trim()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/merogadget'

  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt)

    const admin = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    console.log('Admin user ready:')
    console.log(`  Email:    ${admin.email}`)
    console.log(`  Name:     ${admin.name}`)
    console.log(`  Role:     ${admin.role}`)
    console.log(`  Password: ${ADMIN_PASSWORD} (from ADMIN_PASSWORD in .env or default)`)
    console.log('\nLogin at http://localhost:3000/admin/login')

    process.exit(0)
  } catch (error) {
    console.error('Seed admin error:', error.message)
    process.exit(1)
  }
}

seedAdmin()
