import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/UserModels.js'
import validator from 'email-validator';
import { generateAccessToken } from '../utils/AccessTokens.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!validator.validate(email)) {
    res.status(400).send({ "error": 'Enter a valid email' })
  }
  else {
    const user = await User.findOne({ email: email })
    if (user && await bcrypt.compare(password, user.password)) {
      if (user.active && user.disabled === false) {
        res.json({
          first_name: user.first_name,
          last_name: user.last_name,
          access_token: generateAccessToken(user.email),
          role: user.role
        })
      } else {
        res.status(401).send({ "error": 'The account is not active. Please contact the administrator' })
      }
    }
    else {
        res.status(401).send({ "error": 'Invalid email or password' })
    }
  }
})
export default authUser;
//module.exports = authUser;
