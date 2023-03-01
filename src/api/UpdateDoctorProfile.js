import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import Appointment from '../models/AppointmentModel.js'
import User from '../models/UserModels.js'
import DoctorProfile from '../models/DoctorProfileModel.js';

// @desc    Validate access token
// @route   POST /api/appointments/set-availability
// @access  Public
const UpdateDoctorProfile = asyncHandler(async (req, res) => {
    const {
        specialization,
        educationalQualifications
    } = req.body
    if (specialization && educationalQualifications) {
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
                const UpdateDoctorProfile = new DoctorProfile({
                    doctor_email_id: doctor_email_id,
                    Specialization: specialization,
                    EducationalQualifications: educationalQualifications
                })
                await UpdateDoctorProfile.save()
                res.status(201).send({ "success": 'The Availability has been set successfully' })
            }
            else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
        }
        else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else {
        res.status(400).send({ "error": 'Start time and End time is required' })
    }
})
export default UpdateDoctorProfile;
