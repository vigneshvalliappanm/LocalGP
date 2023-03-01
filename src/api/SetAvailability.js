import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import Appointment from '../models/AppointmentModel.js'
import User from '../models/UserModels.js'
import Content from '../models/ContentModel.js';

// @desc    Validate access token
// @route   POST /api/appointments/set-availability
// @access  Public
const SetAvailability = asyncHandler(async (req, res) => {
  const {
    start_time,
    end_time
  } = req.body
  let appointment_slot_time = 1800;
  const appointment_time = await Content.find({}, 'appointment_time')
  if(appointment_time && appointment_time[0] && appointment_time[0].appointment_time) {
    appointment_slot_time = appointment_time[0].appointment_time * 60;
  }
  
  if (start_time && end_time) {
    if (Date.now() > start_time) {
      res.status(400).send({ "error": 'The Available timeslot cannot be in the past' })
    }
    else if (start_time > end_time) {
      res.status(400).send({ "error": 'The start time cannot be greater than end time.' })
    }
    else if (start_time === end_time) {
      res.status(400).send({ "error": 'The End time cannot be the same as Start time.' })
    }
    else if ((end_time - start_time) / 1000 < appointment_slot_time) {
      res.status(400).send({ "error": 'The availability time should be atleast 30 mins' })
    }
    else if (((end_time - start_time) / 1000) % appointment_slot_time !== 0) {
      res.status(400).send({ "error": 'The availability time should be multiples of 30 mins' })
    }
    else {
      const token = req.headers['authorization']
      if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
      let doctor_email_id = null;
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
        if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
        doctor_email_id = user_email_id.email_id
      })
      if (doctor_email_id !== null) {
        let user = await User.findOne({ email: doctor_email_id })
        if (user.role === 'doctor' || user.role === 'nurse') {
          let appointment_title = "Available"
          const numberOfTimeSlots = ((end_time - start_time) / appointment_slot_time) / 1000;
          let currentSlotStartTime = start_time
          let currentSlotEndTime = end_time
          for (let index = 0; index < numberOfTimeSlots; index++) {
            currentSlotEndTime = currentSlotStartTime + (appointment_slot_time * 1000);
            if (currentSlotEndTime <= end_time) {
              let existingAppointment = await Appointment.findOne({
                doctor_email_id: doctor_email_id,
                start: currentSlotStartTime,
                end: currentSlotEndTime
              })
              if (!existingAppointment) {
                const createAvailability = new Appointment({
                  doctor_email_id: doctor_email_id,
                  start: currentSlotStartTime,
                  end: currentSlotEndTime,
                  title: appointment_title,
                  slot_available: true,
                })
                await createAvailability.save()
              }
              currentSlotStartTime = currentSlotEndTime;
            }
          }

          res.status(201).send({ "success": 'The Availability has been set successfully' })
        }
        else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
      }
      else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
  }
  else {
    res.status(400).send({ "error": 'Start time and End time is required' })
  }
})
export default SetAvailability;
