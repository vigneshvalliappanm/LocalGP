import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'

// @desc    Get all User
// @route   GET /api/users/all
// @access  Admin
const GetAllUsers = asyncHandler(async (req, res) => {
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
      const UserDetails = await User.find({role: {$ne: "admin"}, disabled: false})
      res.status(200).json(UserDetails)
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
})
export default GetAllUsers;
