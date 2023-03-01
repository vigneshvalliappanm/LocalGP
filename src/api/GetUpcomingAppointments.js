import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Appointment from '../models/AppointmentModel.js';

// @desc    Get Available Appointments
// @route   GET /api/appointments/get-upcoming-appointments
// @access  Public
const GetUpcomingAppointments = asyncHandler(async (req, res) => {
    const token = req.headers['authorization']
    if (token == null) return res.status(401).send({ "error": 'Not Authorised. Try logging in again' })
    let current_email_id = null;
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
        if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
        current_email_id = user_email_id.email_id
    })
    if (current_email_id !== null) {
        let user = await User.findOne({ email: current_email_id })
        if (user.role === 'patient') {
            Appointment.aggregate([
                {
                    $match: {
                        patient_email_id: current_email_id
                    }
                },
                {
                    $match: {
                        start: { $gt: Date.now() }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "doctor_email_id",
                        foreignField: "email",
                        as: "doctor_details"
                    }
                }]).exec(function (err, appointments) {
                    if (err) {
                        res.status(500).json(err)
                    }
                    res.status(200).json(appointments)
                });
        }
        else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })

})
export default GetUpcomingAppointments;
