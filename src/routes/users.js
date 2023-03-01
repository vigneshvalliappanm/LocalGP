import express from 'express';
import authUser from '../api/UserLogin.js';
import registerUser from '../api/UserRegistration.js'
import validateAccessToken from '../api/ValidateAccessToken.js';
import GetNotActiveUsers from '../api/GetNotActiveUsers.js';
import ActivateUser from '../api/ActivateUser.js';
import DeleteUser from '../api/DeleteUser.js';
import GetAllUsers from '../api/GetAllUsers.js';
import DisableUser from '../api/DisableUser.js';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', authUser)
router.post('/register', registerUser)
router.post('/validate-access-token', validateAccessToken)
router.get('/get-not-active-users', GetNotActiveUsers)
router.put('/activate-user', ActivateUser)
router.delete('/delete', DeleteUser)
router.post('/disable', DisableUser)
router.get('/all', GetAllUsers)
export default router;
