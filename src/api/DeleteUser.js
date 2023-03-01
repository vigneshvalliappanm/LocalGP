import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'

// @desc    Delete a User
// @route   DELETE /api/users/delete
// @access  Admin
const DeleteUser = asyncHandler(async (req, res) => {
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
                    await User.findOneAndDelete({ email: email })
                    res.status(200).send({ "success": 'The account has been deleted successfully' })
                }
                else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
            }
            else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else {
        res.status(400).send({ "error": 'Email is required' })
    }
})
export default DeleteUser;
