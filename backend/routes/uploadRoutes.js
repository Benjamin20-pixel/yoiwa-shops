import express from 'express'
import { upload } from '../cloudinary.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

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

router.post('/', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' })
    }
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path
    })
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message })
  }
})

export default router