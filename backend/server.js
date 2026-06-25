import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import seedDatabase from './seed.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Yoiwa Shops API is running 🇬🇭' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB — Yoiwa Shops Database')
    await seedDatabase()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`🚀 Yoiwa Shops server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('❌ MongoDB connection error:', err.message)
  })