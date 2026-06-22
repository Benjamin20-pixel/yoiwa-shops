import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import seedDatabase from './seed.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Yoiwa Shops API is running 🇬🇭' })
})

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas — Yoiwa Shops Database')
    await seedDatabase()
    
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🚀 Yoiwa Shops server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err.message)
  })