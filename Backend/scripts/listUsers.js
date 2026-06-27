import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/merogadget'

try {
  await mongoose.connect(uri)
  const users = await mongoose.connection.db.collection('users')
    .find({}, { projection: { email: 1, role: 1, name: 1 } })
    .toArray()
  console.log(JSON.stringify(users, null, 2))
} catch (err) {
  console.error('Error:', err.message)
} finally {
  await mongoose.disconnect()
}
