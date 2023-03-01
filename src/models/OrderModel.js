import mongoose from 'mongoose'

const OrderModel = mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
    },
    PatientEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    shipping: {
      name: {
        type: String,
        required: true,
      },
      address: {
        line1: {
          type: String,
          required: true,
        },
        line2: {
          type: String,
        },
        city: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        postalCode: {
          type: String,
          required: true,
        }
      },
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    OrderType: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', OrderModel)

export default Order