const express = require('express');
const {
  signUpUser,
  signInUser,
  getUser,
  sendMail,
  getBill,
} = require('../controller/user.controller');
const { verifyUser } = require('../middleware/middleware');
const router = express.Router();

router.post('/signup', signUpUser);
router.post('/signin', signInUser);
router.post('/send-mail', getBill);
router.route('/me').get([verifyUser], getUser);

module.exports = router;
