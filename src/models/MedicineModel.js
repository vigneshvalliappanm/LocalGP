import mongoose from 'mongoose'

const medicineModel = mongoose.Schema(
    {
        nurse_email_id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        available_stock: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true,
    }
)

const Medicine = mongoose.model('Medicine', medicineModel)

export default Medicine