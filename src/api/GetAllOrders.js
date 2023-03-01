import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Order from '../models/OrderModel.js';

// @desc    Get all Orders
// @route   GET /api/medicine/orders
// @access  Admin
const GetAllOrders = asyncHandler(async (req, res) => {
  const token = req.headers['authorization']
  if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  let admin_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    admin_email_id = user_email_id.email_id
  })
  if (admin_email_id !== null) {
    let user = await User.findOne({ email: admin_email_id })

    if (user.role === 'admin') {
      const OrderDetails = await Order.find({deliveryStatus: {$ne: "Delivered"}})
      res.status(200).json(OrderDetails)
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
})
export default GetAllOrders;
