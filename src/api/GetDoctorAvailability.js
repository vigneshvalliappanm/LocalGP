import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import Appointment from '../models/AppointmentModel.js'
import User from '../models/UserModels.js'

// @desc    Get Doctor's appointment
// @route   GET /api/appointments/get-availability
// @access  Public
const GetDoctorAvailability = asyncHandler(async (req, res) => {
  const token = req.headers['authorization']
  if (token == null) return res.status(401).send({ "error": 'Not Authorised. Try logging in again' })
  let doctor_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    doctor_email_id = user_email_id.email_id
  })
  if (doctor_email_id !== null) {
    let user = await User.findOne({ email: doctor_email_id })

    if (user.role === 'doctor' || user.role === 'nurse') {
      await Appointment.deleteMany({start: { $lt: Date.now() }, slot_available: true, doctor_email_id: doctor_email_id})
      Appointment.find({ doctor_email_id: user.email }, 'start end title', function (err, docs) {
        res.status(200).json(docs)
      });
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })

})
export default GetDoctorAvailability;
