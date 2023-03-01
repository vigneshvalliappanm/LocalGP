import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Medicine from '../models/MedicineModel.js'

// @desc    Get Medicine Edit
// @route   GET /api/medicine
// @access  Public
const GetMedicineEdit = asyncHandler(async (req, res) => {
  let {
    search
  } = req.query

  const token = req.headers['authorization']
  if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  let current_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    current_email_id = user_email_id.email_id
  })
  if (current_email_id !== null) {
    let user = await User.findOne({ email: current_email_id })

    if (user.role === 'nurse' || user.role === 'doctor') {
      if (search) {
        await Medicine.find({ "name": { "$regex": search, "$options": "i" } }).sort({ 'updatedAt': -1 }).limit(10).exec(function (err, medicines) {
          res.status(200).json(medicines)
        });
      }
      else {
        await Medicine.find({}).sort({ 'updatedAt': -1 }).limit(10).exec(function (err, medicines) {
          res.status(200).json(medicines)
        });
      }
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
})
export default GetMedicineEdit;
