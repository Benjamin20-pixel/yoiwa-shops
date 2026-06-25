import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()

// ============ Cloudinary Configuration ============

// Configure Cloudinary with error handling
const configureCloudinary = () => {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY', 
    'CLOUDINARY_API_SECRET'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ Missing Cloudinary environment variables:', missingVars.join(', '))
    throw new Error(`Missing Cloudinary configuration: ${missingVars.join(', ')}`)
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Always use HTTPS
  })

  console.log('✅ Cloudinary configured successfully')
}

// Configure Cloudinary
try {
  configureCloudinary()
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error.message)
  process.exit(1)
}

// ============ Storage Configuration ============

// Image quality and optimization settings
const IMAGE_OPTIMIZATION = {
  quality: 'auto:good',
  fetch_format: 'auto',
  crop: 'limit',
  width: 800,
  height: 800
}

// Allowed image formats
const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => {
      // Dynamic folder based on file type or user role
      const userRole = req.user?.role || 'public'
      const category = req.body?.category || 'general'
      return `yoiwa-shops/${userRole}/${category}`
    },
    allowed_formats: ALLOWED_FORMATS,
    transformation: [
      { width: 800, height: 800, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => {
      // Generate unique filename with timestamp
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 10)
      const originalName = file.originalname.split('.')[0].toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
      return `${originalName}-${timestamp}-${randomId}`
    },
    resource_type: 'auto',
    eager: [
      { width: 200, height: 200, crop: 'thumb', gravity: 'face' }, // Thumbnail
      { width: 400, height: 400, crop: 'limit' }, // Medium
      { width: 1200, height: 1200, crop: 'limit' } // Large
    ]
  }
})

// ============ Multer Configuration ============

// File filter for images
const imageFilter = (req, file, cb) => {
  // Check file type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG are allowed.'), false)
  }

  // Check file extension
  const ext = file.originalname.split('.').pop().toLowerCase()
  if (!ALLOWED_FORMATS.includes(ext)) {
    return cb(new Error(`Invalid file extension. Allowed: ${ALLOWED_FORMATS.join(', ')}`), false)
  }

  cb(null, true)
}

// Configure multer
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10 // Max 10 files per upload
  },
  fileFilter: imageFilter
})

// ============ Utility Functions ============

/**
 * Upload multiple images with progress tracking
 * @param {Array} files - Array of file objects
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} - Array of uploaded image URLs
 */
export const uploadMultiple = async (files, options = {}) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }

  const uploadPromises = files.map(async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: options.folder || 'yoiwa-shops',
        transformation: options.transformation || IMAGE_OPTIMIZATION,
        public_id: options.publicId || undefined,
        ...options
      })
      return result
    } catch (error) {
      console.error('Error uploading file:', error.message)
      throw error
    }
  })

  return Promise.all(uploadPromises)
}

/**
 * Upload single image
 * @param {Object} file - File object
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result
 */
export const uploadSingle = async (file, options = {}) => {
  if (!file) {
    throw new Error('No file provided')
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: options.folder || 'yoiwa-shops',
      transformation: options.transformation || IMAGE_OPTIMIZATION,
      public_id: options.publicId || undefined,
      ...options
    })
    return result
  } catch (error) {
    console.error('Error uploading file:', error.message)
    throw error
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteImage = async (publicId) => {
  if (!publicId) {
    throw new Error('Public ID is required')
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`)
    }
    return result
  } catch (error) {
    console.error('Error deleting image:', error.message)
    throw error
  }
}

/**
 * Delete multiple images
 * @param {Array} publicIds - Array of public IDs
 * @returns {Promise<Array>} - Delete results
 */
export const deleteMultipleImages = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) {
    throw new Error('No public IDs provided')
  }

  const deletePromises = publicIds.map(async (publicId) => {
    try {
      return await deleteImage(publicId)
    } catch (error) {
      console.error(`Error deleting image ${publicId}:`, error.message)
      return { error: error.message, publicId }
    }
  })

  return Promise.all(deletePromises)
}

/**
 * Get optimized image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  if (!publicId) return ''

  const defaultOptions = {
    quality: 'auto:good',
    fetch_format: 'auto',
    crop: 'limit',
    width: 800,
    height: 800
  }

  const mergedOptions = { ...defaultOptions, ...options }
  
  // Build transformation string
  const transformations = Object.entries(mergedOptions)
    .map(([key, value]) => `${key}_${value}`)
    .join(',')

  return cloudinary.url(publicId, {
    transformation: transformations
  })
}

/**
 * Get image URL with specific size
 * @param {string} publicId - Cloudinary public ID
 * @param {string} size - Size: 'thumb', 'medium', 'large', 'original'
 * @returns {string} - Image URL
 */
export const getImageBySize = (publicId, size = 'medium') => {
  if (!publicId) return ''

  const sizes = {
    thumb: { width: 200, height: 200, crop: 'thumb', gravity: 'face' },
    medium: { width: 400, height: 400, crop: 'limit' },
    large: { width: 800, height: 800, crop: 'limit' },
    original: {}
  }

  const options = sizes[size] || sizes.medium
  return cloudinary.url(publicId, options)
}

/**
 * Get image info from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Image information
 */
export const getImageInfo = async (publicId) => {
  if (!publicId) {
    throw new Error('Public ID is required')
  }

  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error) {
    console.error('Error getting image info:', error.message)
    throw error
  }
}

/**
 * Update image metadata
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} metadata - Metadata to update
 * @returns {Promise<Object>} - Updated image info
 */
export const updateImageMetadata = async (publicId, metadata) => {
  if (!publicId) {
    throw new Error('Public ID is required')
  }

  try {
    const result = await cloudinary.api.update(publicId, {
      metadata
    })
    return result
  } catch (error) {
    console.error('Error updating image metadata:', error.message)
    throw error
  }
}

// ============ Express Middleware ============

/**
 * Express middleware for handling image upload errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5MB.'
      })
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Too many files uploaded.'
      })
    }
    return res.status(400).json({
      error: err.message
    })
  }
  
  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: err.message
    })
  }

  next(err)
}

/**
 * Upload middleware for multiple files
 */
export const uploadMultipleMiddleware = (fieldName = 'images', maxCount = 10) => {
  return upload.array(fieldName, maxCount)
}

/**
 * Upload middleware for single file
 */
export const uploadSingleMiddleware = (fieldName = 'image') => {
  return upload.single(fieldName)
}

// ============ Export ============

export default {
  cloudinary,
  upload,
  uploadSingle,
  uploadMultiple,
  deleteImage,
  deleteMultipleImages,
  getOptimizedImageUrl,
  getImageBySize,
  getImageInfo,
  updateImageMetadata,
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
  handleUploadError,
  IMAGE_OPTIMIZATION,
  ALLOWED_FORMATS,
  MAX_FILE_SIZE
}