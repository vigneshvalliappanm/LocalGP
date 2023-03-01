import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';

// @desc    Validate access token
// @route   POST /api/users/validate-access-token
// @access  Public
const validateAccessToken = asyncHandler(async (req, res) => {
    const { accessToken } = req.body
    jwt.verify(accessToken, process.env.TOKEN_SECRET, (error, user_email_id) => {
        if (error) res.status(401).send('Invalid token')
        else return res.status(200).send('Valid token')
    })
})
export default validateAccessToken;
