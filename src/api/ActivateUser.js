import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import sendEmail from '../utils/SendEmail.js';

// @desc    Validate access token
// @route   PUT /api/users/activate-user
// @access  Public
const ActivateUser = asyncHandler(async (req, res) => {
  const {
    email
  } = req.body
  if (email) {
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
        await User.findOneAndUpdate({ email: email }, { active: true })
        res.status(200).send({ "success": 'The account has been activated' })
        let mailSubject = "Your account has been approved"
        let mailBodyContent = "We reviewed your account and have approved your account.<br\>Please login to your account by entering your credendials."
        let mailBody = "Hi, <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
        await sendEmail(email, mailSubject, mailBody)
      }
      else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else {
    res.status(400).send({ "error": 'Email is required' })
  }
})
export default ActivateUser;
