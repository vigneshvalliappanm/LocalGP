import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Prescription from '../models/PrescriptionModel.js';
import Appointment from '../models/AppointmentModel.js';
import sendEmail from '../utils/SendEmail.js';

// @desc    Upload Prescription
// @route   POST /api/medicine/upload-prescription
// @access  Public
const UploadPrescription = asyncHandler(async (req, res) => {
  let {
    AppointmentId,
    Medicines
  } = req.body
  const token = req.headers['authorization']
  if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  let current_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    current_email_id = user_email_id.email_id
  })
  if (current_email_id !== null) {
    let user = await User.findOne({ email: current_email_id })
    let hasErrors = false;
    if (user.role === 'doctor') {
      if (!AppointmentId) {
        hasErrors = true;
        res.status(400).send({ "error": 'Id of the Appointment Cannot be empty' })
      }
      Medicines.forEach(function (Medicine, key) {
        if (!Medicine.medicine_name) {
          hasErrors = true;
          res.status(400).send({ "error": 'Name of the medicine Cannot be empty' })
        }
        else if (!Medicine.dosage.morning) {
          hasErrors = true;
          res.status(400).send({ "error": 'Dosage - Morning Cannot be empty' })
        }
        else if (!Medicine.dosage.afternoon) {
          hasErrors = true;
          res.status(400).send({ "error": 'Dosage - Afternoon Cannot be empty' })
        }
        else if (!Medicine.dosage.night) {
          hasErrors = true;
          res.status(400).send({ "error": 'Dosage - Night Cannot be empty' })
        }
        else if (!Medicine.dosage.number_of_days) {
          hasErrors = true;
          res.status(400).send({ "error": 'Number of Days cannot be empty' })
        }
        else if (Medicine.dosage.number_of_days <= 0) {
          hasErrors = true;
          res.status(400).send({ "error": 'Number of Days cannot be zero or less than zero' })
        }
        else if (!Medicine.quantity) {
          hasErrors = true;
          res.status(400).send({ "error": 'Quantity cannot be empty' })
        }
      })

      if (!hasErrors) {
        let OldPrescription = await Prescription.findOne({ appointment_id: AppointmentId })
        if (OldPrescription) {
          res.status(400).send({ "error": 'The Prescription has already been updated' })
          return
        }
        const CreatePrescription = new Prescription({
          appointment_id: AppointmentId,
          prescription: Medicines
        })
        await CreatePrescription.save()
        let AppointmentDetails = await Appointment.findById(AppointmentId);
        if (AppointmentDetails.patient_email_id) {
          let mailSubject = "The prescription has been uploaded to the portal by the GP"
          let mailBodyContent = "The GP has uploaded the prescription for your recent appointment.<br\>Please login to the portal to view, download or to order the prescription."
          let mailBody = "Hi, <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
          await sendEmail(AppointmentDetails.patient_email_id, mailSubject, mailBody)
        }

        res.status(200).send({ "success": 'The Prescription has been Uploaded successfully' })
      }
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
})
export default UploadPrescription;
