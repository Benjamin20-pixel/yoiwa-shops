import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin', 'rider'],
    default: 'customer'
  },
  storeName: { type: String, default: '' },
  storeDescription: { type: String, default: '' },
  category: { type: String, default: '' },
  vehicleType: { type: String, default: '' },
  licenseNumber: { type: String, default: '' }
}, { timestamps: true })

export default mongoose.model('User', userSchema)