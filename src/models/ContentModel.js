import mongoose from 'mongoose'

const contentSchema = mongoose.Schema(
  {
    front_page_content: {
      type: String,
      required: true,
    },
    patient_page_content: {
      type: String,
      required: true,
    },
    appointment_time: {
      type: Number,
      required: true,
    },
    updated_by: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Content = mongoose.model('Content', contentSchema)

export default Content