import mongoose from 'mongoose'

const appointmentSchema = mongoose.Schema(
  {
    doctor_email_id: {
      type: String,
      required: true,
    },
    start: {
        type: Number,
        required: true,
    },
    end: {
        type: Number,
        required: true,
    },
    title: {
      type: String,
      required: true
    },
    doctor_comments: {
      type: String
    },
    patient_email_id: {
        type: String,
    },
    slot_available: {
        type: Boolean,
        required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Appointment = mongoose.model('Appointment', appointmentSchema)

export default Appointment