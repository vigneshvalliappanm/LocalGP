import express from 'express';
import SetAvailability from '../api/SetAvailability.js';
import GetDoctorAvailability from '../api/GetDoctorAvailability.js';
import GetAvailableAppointments from '../api/GetAvailableAppointments.js';
import BookAppointment from '../api/BookAppointment.js';
import GetUpcomingAppointments from '../api/GetUpcomingAppointments.js';
import CancelAppointment from '../api/CancelAppointment.js';
import DeleteAvailablity from '../api/deleteAvailablity.js';
import GetAppointmentDetails from '../api/GetAppointmentDetails.js';
import UpdateDoctorComments from '../api/UpdateDoctorComments.js';
import GetPastAppointments from '../api/GetPastAppointments.js';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/set-availability', SetAvailability)
router.get('/get-doctor-availability', GetDoctorAvailability)
router.get('/get-available-appointments', GetAvailableAppointments)
router.put('/book-appointment', BookAppointment)
router.get('/get-upcoming-appointments', GetUpcomingAppointments)
router.get('/get-past-appointments', GetPastAppointments)
router.get('/get-appointmentdetails', GetAppointmentDetails)
router.put('/cancel-appointment', CancelAppointment)
router.put('/update-doctor-comment', UpdateDoctorComments)
router.delete('/delete-availablity', DeleteAvailablity)
export default router;
