import express from 'express'
import Order from '../models/Order.js'
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

// Place an order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, delivery, payment, total } = req.body

    const order = await Order.create({
      customer: req.user.id,
      items,
      delivery,
      payment,
      total
    })

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      order
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get all orders (admin/seller)
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email phone')
      .populate('items.product', 'name price')
      .populate('rider', 'name phone')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get single order by ID (for rider)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name price')
      .populate('rider', 'name phone')

    if (!order) return res.status(404).json({ message: 'Order not found' })

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Update order status (rider/seller)
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, riderId } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    order.status = status
    if (riderId) order.rider = riderId
    await order.save()

    res.json({ message: 'Order updated successfully', order })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Get customer's own orders
router.get('/my/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router