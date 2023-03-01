import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Prescription from '../models/PrescriptionModel.js';

// @desc    View Prescription
// @route   POST /api/appointments/view-prescription
// @access  Public
const ViewPrescription = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body
  const token = req.headers['authorization']
  if (token == null) return res.status(401).send({ "error": 'Not Authorised. Try logging in again' })
  let current_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    current_email_id = user_email_id.email_id
  })
  if (current_email_id !== null) {
    let user = await User.findOne({ email: current_email_id })

    if (user.role === 'doctor' || user.role === 'patient') {
      Prescription.aggregate([
        {
          $match: {
            appointment_id: appointmentId
          }
        },
        {
          $lookup: {
            from: "medicines",
            localField: "prescription.medicine_name",
            foreignField: "name",
            as: "medicine_details"
          }
        }]).exec(function (err, prescription) {
          if (err) {
            res.status(500).json({ "error": err })
          }
          res.status(200).json(prescription)
        });
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })

})
export default ViewPrescription;
