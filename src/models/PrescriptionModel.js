import mongoose from 'mongoose'

const PrescriptionModel = mongoose.Schema(
  {
    appointment_id: {
      type: String,
      required: true,
      unique: true,
    },
    prescription: [{
      medicine_name: {
        type: String,
        required: true,
      },
      dosage: {
        morning: {
          type: String,
          required: true,
        },
        afternoon: {
          type: String,
          required: true,
        },
        night: {
          type: String,
          required: true,
        },
        number_of_days: {
          type: String,
          required: true,
        }
      },
      quantity: {
        type: Number,
        required: true,
      }
    }]
  },
  {
    timestamps: true,
  }
)

const Prescription = mongoose.model('Prescription', PrescriptionModel)

export default Prescription