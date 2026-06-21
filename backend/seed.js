import mongoose from 'mongoose'
import Product from './models/Product.js'
import User from './models/User.js'
import bcrypt from 'bcryptjs'

const seedDatabase = async () => {
  try {
    // Create a default seller
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    let seller = await User.findOne({ email: 'seller@yoiwashops.com' })
    if (!seller) {
      seller = await User.create({
        name: 'Yoiwa Shops',
        email: 'seller@yoiwashops.com',
        phone: '0240000000',
        password: hashedPassword,
        role: 'seller'
      })
    }

    // Check if products already exist
    const existingProducts = await Product.countDocuments()
    if (existingProducts > 0) return

    // Seed products
    await Product.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'High quality wireless headphones with noise cancellation',
        price: 250,
        category: 'Electronics',
        stock: 10,
        seller: seller._id
      },
      {
        name: "Men's Casual Shirt",
        description: 'Comfortable and stylish casual shirt for men',
        price: 85,
        category: 'Fashion',
        stock: 20,
        seller: seller._id
      },
      {
        name: 'Rice Cooker',
        description: 'Electric rice cooker with automatic keep warm function',
        price: 180,
        category: 'Home',
        stock: 15,
        seller: seller._id
      },
      {
        name: 'Face Moisturizer',
        description: 'Hydrating face moisturizer for all skin types',
        price: 60,
        category: 'Beauty',
        stock: 30,
        seller: seller._id
      },
      {
        name: 'Smart Watch',
        description: 'Feature-packed smart watch with health tracking',
        price: 420,
        category: 'Electronics',
        stock: 8,
        seller: seller._id
      },
      {
        name: 'Ladies Sandals',
        description: 'Comfortable and stylish ladies sandals',
        price: 95,
        category: 'Fashion',
        stock: 25,
        seller: seller._id
      }
    ])

    console.log('✅ Database seeded with default products')
  } catch (err) {
    console.log('❌ Seeding error:', err.message)
  }
}

export default seedDatabase