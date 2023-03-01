import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Appointment from '../models/AppointmentModel.js';

// @desc    Delete Availablity
// @route   DELETE /api/appointments/delete-availablity
// @access  Public
const DeleteAvailablity = asyncHandler(async (req, res) => {
    const {
        appointment_id
    } = req.body
    if (appointment_id) {
            const token = req.headers['authorization']
            if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
            let current_email_id = null;
            jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
                if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
                current_email_id = user_email_id.email_id
            })
            if (current_email_id !== null) {
                let user = await User.findOne({ email: current_email_id })

                if (user.role === 'patient' || user.role === 'doctor') {
                    await Appointment.findByIdAndDelete(appointment_id)
                    res.status(200).send({ "success": 'The availablity has been deleted successfully' })
                }
                else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
            }
            else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else {
        res.status(400).send({ "error": 'Appointment Id is required' })
    }
})
export default DeleteAvailablity;
