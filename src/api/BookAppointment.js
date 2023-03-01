import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Appointment from '../models/AppointmentModel.js';
import sendEmail from '../utils/SendEmail.js';


// @desc    Validate access token
// @route   PUT /api/appointments/book-appointment
// @access  Public
const BookAppointment = asyncHandler(async (req, res) => {
  const {
    appointment_id,
    appointment_desc
  } = req.body
  if (appointment_id && appointment_desc) {
    const token = req.headers['authorization']
    if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    let current_email_id = null;
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
      if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
      current_email_id = user_email_id.email_id
    })
    if (current_email_id !== null) {
      let user = await User.findOne({ email: current_email_id })

      if (user.role === 'patient') {
        let appointment_title = "Appointment with " + user.first_name + " " + user.last_name + " - " + appointment_desc
        const result = await Appointment.findByIdAndUpdate(appointment_id, { patient_email_id: current_email_id, title: appointment_title, slot_available: false })
        if (result && result.doctor_email_id.length) {
          let date = new Date(result.start).getDate() + "-" + (new Date(result.start).getMonth() + 1) + "-" + new Date(result.start).getFullYear()
          let start_time = new Date(result.start).getHours() + ":" + new Date(result.start).getMinutes()
          let end_time = new Date(result.end).getHours() + ":" + new Date(result.end).getMinutes()
          let mailSubject = "Your appointment has been booked"
          let mailBodyContent = "Your appointment has been booked successfully. Please find the appointment details below<br\>Appointment Date: " + date + "<br\>Appointment time: " + start_time + " - " + end_time
          let mailBody = "Hi, <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
          sendEmail(result.doctor_email_id, mailSubject, mailBody)
          sendEmail(current_email_id, mailSubject, mailBody)
        }
        res.status(200).send({ "success": 'The appointment has been booked successfully' })
      }
      else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else {
    res.status(400).send({ "error": 'Appointment Id and Appointment Description is required' })
  }
})
export default BookAppointment;
