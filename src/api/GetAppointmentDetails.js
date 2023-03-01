import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Appointment from '../models/AppointmentModel.js';

// @desc    Get Appointment details
// @route   GET /api/appointments/get-appointmentdetails
// @access  Public
const GetAppointmentDetails = asyncHandler(async (req, res) => {
  const {
    AppointmentId
  } = req.query
  const token = req.headers['authorization']
  if (token == null) return res.status(401).send({ "error": 'Not Authorised. Try logging in again' })
  let current_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    current_email_id = user_email_id.email_id
  })
  if (current_email_id !== null) {
    let user = await User.findOne({ email: current_email_id })
    if (user) {
      Appointment.aggregate([
        {
          $match: {
            $expr: {
              $eq: [
                '$_id', {
                  $toObjectId: AppointmentId
                }
              ]
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "doctor_email_id",
            foreignField: "email",
            as: "doctor_details"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "patient_email_id",
            foreignField: "email",
            as: "patient_details"
          }
        },
        {
          $lookup: {
            from: "appointments",
            localField: "patient_email_id",
            foreignField: "patient_email_id",
            as: "patient_history"
          }
        }
      ]).exec(function (err, appointment_details) {
        if (err) {
          res.status(500).json(err)
        }
        res.status(200).json(appointment_details)
      });
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })

})
export default GetAppointmentDetails;
