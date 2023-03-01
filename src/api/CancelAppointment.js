import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Appointment from '../models/AppointmentModel.js';
import sendEmail from '../utils/SendEmail.js';

// @desc    Cancel Booked Appointment
// @route   PUT /api/appointments/cancel-appointment
// @access  Public
const CancelAppointment = asyncHandler(async (req, res) => {
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
                const result = await Appointment.findByIdAndUpdate(appointment_id, { patient_email_id: "", slot_available: true, title: "Available" })
                if (result && result.patient_email_id.length){
                    let date = new Date(result.start).getDate() + "-" + (new Date(result.start).getMonth() + 1) + "-" + new Date(result.start).getFullYear()
                let start_time = new Date(result.start).getHours() + ":" + new Date(result.start).getMinutes()
                let end_time = new Date(result.end).getHours() + ":" + new Date(result.end).getMinutes()
                let mailSubject = "Your appointment has been cancelled"
                let mailBodyContent = "Your appointment on " + date + " at " + start_time + " - " + end_time + " has been cancelled."
                let mailBody = "Hi, <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
                sendEmail(result.doctor_email_id, mailSubject, mailBody);
                sendEmail(result.patient_email_id, mailSubject, mailBody);
            }
            res.status(200).send({ "success": 'The appointment has been cancelled successfully' })
        }
        else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
}
    else {
    res.status(400).send({ "error": 'Appointment Id is required' })
}
})
export default CancelAppointment;
