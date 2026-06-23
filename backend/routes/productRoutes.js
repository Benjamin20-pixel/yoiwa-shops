import express from 'express'
import Product from '../models/Product.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get all products
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query

    let filter = {}

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' }
    }

    const products = await Product.find(filter).populate('seller', 'name email')
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Add product (sellers only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
      seller: req.user.id
    })

    res.status(201).json({ message: 'Product added successfully', product })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Delete product
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    
    await product.deleteOne()
    res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router