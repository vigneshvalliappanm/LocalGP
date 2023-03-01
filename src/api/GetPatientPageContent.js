import asyncHandler from 'express-async-handler'
import Content from '../models/ContentModel.js';

// @desc    Get Doctor's appointment
// @route   GET /api/contents
// @access  Public
const GetPatientPageContent = asyncHandler(async (req, res) => {
    Content.find({},'patient_page_content', function (err, docs) {
        res.status(200).json(docs)
    });

})
export default GetPatientPageContent;
