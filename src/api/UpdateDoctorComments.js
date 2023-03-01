import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import Appointment from '../models/AppointmentModel.js'
import User from '../models/UserModels.js'
import sendEmail from '../utils/SendEmail.js';

// @desc    Update Doctor Comment
// @route   PUT /api/appointments/update-doctor-comment
// @access  Public
const UpdateDoctorComments = asyncHandler(async (req, res) => {
  const {
    appointmentComment,
    appointmentId
  } = req.body
  if (appointmentComment && appointmentId) {
    const token = req.headers['authorization']
    if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    let doctor_email_id = null;
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
      if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
      doctor_email_id = user_email_id.email_id
    })
    if (doctor_email_id !== null) {
      let user = await User.findOne({ email: doctor_email_id })
      if (user.role === 'doctor') {
        const result = await Appointment.findByIdAndUpdate(appointmentId, { doctor_comments: appointmentComment })
          if (result && result.patient_email_id.length) {
            let mailSubject = "The GP has updated their comments on the portal"
            let mailBodyContent = "The GP has updated their comments for your recent appointment.<br\>Please login to the portal to view the comments."
            let mailBody = "Hi, <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
            sendEmail(result.patient_email_id, mailSubject, mailBody);
          }
        res.status(200).send({ "success": 'Your comments has been updated successfully' })
      }
      else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else {
    res.status(400).send({ "error": "Doctor's comments and Appointment Id is required" })
  }
})
export default UpdateDoctorComments;
