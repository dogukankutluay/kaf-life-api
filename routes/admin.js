const express = require('express');
const router = express.Router();

const { getUsers, userStatusAction } = require('../controller/admin');
const { isThereAUserAndFind } = require('../middleware/auth');
router
  .post('/getUsers', [isThereAUserAndFind], getUsers)
  .post('/userStatusAction', [isThereAUserAndFind], userStatusAction);

module.exports = router;
