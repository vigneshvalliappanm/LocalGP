import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Order from '../models/OrderModel.js';


// @desc    Checkout Order
// @route   GET /api/medicine/checkorder
// @access  Public
const CheckOrder = asyncHandler(async (req, res) => {
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
    if (user.role === 'patient') {
      const OrderDetails = await Order.findOne({appointmentId: appointmentId});
      if(OrderDetails) {
      res.status(200).json(OrderDetails)
      }
      else
        res.status(400).send({ "error": "Order Not Found" })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })

})
export default CheckOrder;
