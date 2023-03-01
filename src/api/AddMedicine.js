import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Medicine from '../models/MedicineModel.js'

// @desc    add medicine
// @route   POST /api/medicine/add
// @access  Public
const AddMedicine = asyncHandler(async (req, res) => {
  let {
    name,
    type,
    price,
    available_stock
  } = req.body

  const token = req.headers['authorization']
  if (token == null) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  let current_email_id = null;
  jwt.verify(token, process.env.TOKEN_SECRET, (error, user_email_id) => {
    if (error) return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    current_email_id = user_email_id.email_id
  })
  if (current_email_id !== null) {
    let user = await User.findOne({ email: current_email_id })

    if (user.role === 'nurse') {
      available_stock = parseInt(available_stock)
      price = parseFloat(price)
      if (!name) {
        res.status(400).send({ "error": 'Name of the medicine Cannot be empty' })
      }
      else if (!type) {
        res.status(400).send({ "error": 'Type of the medicine Cannot be empty' })
      }
      else if (!price) {
        res.status(400).send({ "error": 'Price of the medicine Cannot be empty' })
      }
      else if (!available_stock) {
        res.status(400).send({ "error": 'Stock of the medicine Cannot be empty' })
      }
      else if (!Number.isInteger(available_stock)) {
        res.status(400).send({ "error": 'Stock of the medicine must be a number' })
      }
      else if (price <= 0) {
        res.status(400).send({ "error": 'Price cannot be zero or less than zero' })
      }
      else {
        const existingMedicine = await Medicine.findOne({ name: name })
        if (existingMedicine) res.status(400).send({ "error": "This medicine has already been added. Please edit the medicine." })
        else {
          const createMedicine = new Medicine({
            nurse_email_id: current_email_id,
            name: name,
            type: type,
            price: price,
            available_stock: available_stock
          })
          await createMedicine.save()
          res.status(201).send({ "success": 'The medicine has been added successfully' })
        }
      }
    }
    else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
  }
  else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
})
export default AddMedicine;
