import express from 'express';
import SetFrontEndContent from '../api/SetFrontEndContent.js';
import GetFrontEndContent from '../api/GetFrontEndContent.js';
var router = express.Router();


/* GET users listing. */
router.get('/', GetFrontEndContent);

router.post('/update', SetFrontEndContent)
export default router;
