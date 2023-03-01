import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import sendEmail from '../utils/SendEmail.js';
import Order from '../models/OrderModel.js';

// @desc    Update Delivery Status
// @route   PUT /api/medicine/order/update-delivery-status
// @access  Public
const UpdateDeliveryStatus = asyncHandler(async (req, res) => {
  const {
    orderId,
    deliveryStatus
  } = req.body
  if (deliveryStatus && orderId) {
    const token = req.headers['authorization']
    if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    let current_email_id = null;
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
      if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
      current_email_id = user_email_id.email_id
    })
    if (current_email_id !== null) {
      let user = await User.findOne({ email: current_email_id })
      if (user.role === 'admin') {
        const result = await Order.findByIdAndUpdate(orderId, { deliveryStatus: deliveryStatus })
          if (result && result.PatientEmail.length) {
            let mailSubject = "Your order is " + deliveryStatus
            let mailBodyContent = "Your recent order at the LocalGP has been " + deliveryStatus + "<br\> Thanks for using LocalGP"
            let mailBody = "Hi, <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
            sendEmail(result.PatientEmail, mailSubject, mailBody);
          }
        res.status(200).send({ "success": 'Delivery Status has been updated successfully' })
      }
      else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else {
    res.status(400).send({ "error": "Doctor's comments and Appointment Id is required" })
  }
})
export default UpdateDeliveryStatus;
