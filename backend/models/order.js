import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  delivery: {
    name: String,
    phone: String,
    pinLocation: {
      lat: Number,
      lng: Number
    },
    description: String
  },
  payment: {
    method: String,
    momoNumber: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'picked_up', 'delivered', 'cancelled'],
    default: 'placed'
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  total: Number
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)