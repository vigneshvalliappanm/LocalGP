import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js'
import Content from '../models/ContentModel.js';

// @desc    Validate access token
// @route   PUT /api/contents/update
// @access  Public
const SetFrontEndContent = asyncHandler(async (req, res) => {
    const {
        front_page_content,
        patient_page_content,
        appointment_time
    } = req.body
    if (front_page_content && patient_page_content) {
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
                    const old_content = await Content.findOne({})
                    if(old_content) {
                        await Content.findOneAndUpdate({}, {front_page_content: front_page_content, patient_page_content: patient_page_content, appointment_time: appointment_time})
                    }
                    else {
                        const UpdatedContent = new Content({
                            front_page_content: front_page_content,
                            patient_page_content: patient_page_content,
                            appointment_time: appointment_time,
                            updated_by: admin_email_id
                        })
                        await UpdatedContent.save()
                    }
                    res.status(200).send({ "success": 'Content Updated Successfully' })
                }
                else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
            }
            else return res.status(403).send({ "error": 'Not Authorised. Try logging in again' })
    }
    else {
        res.status(400).send({ "error": 'Patient Page Content and Front Page Content are required' })
    }
})
export default SetFrontEndContent;
