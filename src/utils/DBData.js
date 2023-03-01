import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from '../data/users.js'
import User from '../models/UserModels.js'
import connectDB from './ConnectDB.js'
import Appointment from '../models/AppointmentModel.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {

    const createdUsers = await User.insertMany(users)



    console.log('Data Imported!')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}
importData()