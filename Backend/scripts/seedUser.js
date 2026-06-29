import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import User from '../models/user.js'

dotenv.config()

const USER_NAME = process.env.USER_NAME || 'Test User'
const USER_EMAIL = (process.env.USER_EMAIL || 'user@merogadget.com').toLowerCase().trim()
const USER_PASSWORD = process.env.USER_PASSWORD || 'user123'
const USER_PHONE = process.env.USER_PHONE || '9800000000'
const USER_ADDRESS = process.env.USER_ADDRESS || 'Kathmandu, Nepal'

const seedUser = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/merogadget'

  try {
    await mongoose.connect(uri)
    console.log('Connected to MongoDB')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(USER_PASSWORD, salt)

    const user = await User.findOneAndUpdate(
      { email: USER_EMAIL },
      {
        name: USER_NAME,
        email: USER_EMAIL,
        password: hashedPassword,
        role: 'user',
        phone: USER_PHONE,
        address: USER_ADDRESS,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    console.log('Store user ready:')
    console.log(`  Email:    ${user.email}`)
    console.log(`  Password: ${USER_PASSWORD}`)
    console.log(`  Name:     ${user.name}`)
    console.log(`  Role:     ${user.role}`)
    console.log('\nLogin at http://localhost:3000/login')

    process.exit(0)
  } catch (error) {
    console.error('Seed user error:', error.message)
    process.exit(1)
  }
}

seedUser()
