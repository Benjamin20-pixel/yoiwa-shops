import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { OAuth2Client } from 'google-auth-library'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, storeName, storeDescription, category } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer',
      storeName,
      storeDescription,
      category
    })

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        storeName: user.storeName
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Google Sign In
    router.post('/google', async (req, res) => {
      try {
      const { token } = req.body
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      })

      const payload = ticket.getPayload()
      const { email, name, picture } = payload

      // Check if user already exists
      let user = await User.findOne({ email })

      if (!user) {
        // Create new user
        user = await User.create({
          name,
          email,
          phone: 'N/A',
          password: Math.random().toString(36).slice(-8),
          role: 'customer'
        })
      }

      // Generate token
      const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

      res.json({
        message: 'Google sign in successful',
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      })
    } catch (err) {
      res.status(500).json({ message: 'Google sign in failed', error: err.message })
    }
  })
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router