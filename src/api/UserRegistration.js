import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/UserModels.js'
import validator from 'email-validator';
import sendEmail from '../utils/SendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  let {
    first_name,
    last_name,
    address_line_1,
    post_code,
    phone_number,
    email,
    password,
    role,
    dateOfBirth,
    specialization,
    idNumber
  } = req.body

  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  if (!first_name) {
    res.status(400).send({ "error": 'First Name Cannot be empty' })
  }
  else if (!last_name) {
    res.status(400).send({ "error": 'Last Name Cannot be empty' })
  }
  else if (!address_line_1) {
    res.status(400).send({ "error": 'Address Cannot be empty' })
  }
  else if (!post_code) {
    res.status(400).send({ "error": 'Post Code Cannot be empty' })
  }
  else if (!phone_number) {
    res.status(400).send({ "error": 'Phone Number Cannot be empty' })
  }
  else if (!validator.validate(email)) {
    res.status(400).send({ "error": 'Enter a valid email' })
  }
  else if (!strongRegex.test(password)) {
    res.status(400).send({ "error": 'Enter a strong password' })
  }
  else if (!dateOfBirth) {
    res.status(400).send({ "error": 'Date Of Birth cannot be empty' })
  }
  else if (!role) {
    res.status(400).send({ "error": 'Role Cannot be empty' })
  }
  else if (role === "doctor" && !specialization) {
    res.status(400).send({ "error": 'Specialization Cannot be empty' })
  }
  else if (!idNumber) {
    if (role === "doctor")
      res.status(400).send({ "error": 'GMC Number Cannot be empty' })
    else if (role === "nurse")
      res.status(400).send({ "error": 'NMC Pin Cannot be empty' })
    else if (role === "patient")
      res.status(400).send({ "error": 'NHS Number Cannot be empty' })
  }
  else if (role === "doctor" && !idNumber.match("^[0-9A-Z][0-9]{6}$")) {
    res.status(400).send({ "error": 'Enter a valid GMC Number' })
  }
  else if (role === "nurse" && !idNumber.match("^[0-9]{2}[A-Z][0-9]{4}[A-Z]$")) {
    res.status(400).send({ "error": 'Enter a valid NMC Pin' })
  }
  else if (role === "patient" && !idNumber.match("^[0-9]{10}$")) {
    res.status(400).send({ "error": 'Enter a valid NHS Number' })
  }
  else {
    let user = await User.findOne({ email: email })
    if (user) {
      res.status(400).send({ "error": 'This Email is already been registered' })
      return
    }
    user = await User.findOne({ phone_number: phone_number })
    if (user) {
      res.status(400).send({ "error": 'This Phone Number is already been registered' })
      return
    }
    user = await User.findOne({ idNumber: idNumber })
    if (user) {
      if (role === 'doctor') {
        res.status(400).send({ "error": 'This GMC Number is already been registered' })
      }
      else if (role === 'nurse') {
        res.status(400).send({ "error": 'This NMC Pin is already been registered' })
      }
      else {
        res.status(400).send({ "error": 'This NHS Number is already been registered' })
      }
      return
    }
    let active = false
    if (role === 'patient') {
      active = true;
    }
    let disabled = false;
    password = bcrypt.hashSync(password, 10);
    let mailSubject = "Successfully Registered to LocalGP's portal"
    let mailBodyContent = "Welcome to the LocalGP's portal. We are currently reviewing your account. We will notify you once your account is approved"
    if (role === "patient") {
      mailBodyContent = "Welcome to the LocalGP's portal. You have successfully registered to the portal.<br\>Please Login to continue"
    }
    let mailBody = "Hi " + first_name + " " + last_name + ", <br\><br\>" + mailBodyContent + "<br\><br\> Regards, <br\> Site Admin"
    const createUser = new User({
      first_name: first_name,
      last_name: last_name,
      address_line_1: address_line_1,
      post_code: post_code,
      phone_number: phone_number,
      email: email,
      password: password,
      dateOfBirth: dateOfBirth,
      role: role,
      active: active,
      disabled: disabled,
      Specialization: specialization.toLowerCase(),
      idNumber: idNumber
    })
    await createUser.save()
    await sendEmail(email, mailSubject, mailBody)
    res.status(201).send({ "success": 'THe user has been registered successfully' })
  }
})
export default registerUser;
