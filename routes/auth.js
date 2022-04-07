const express = require('express');
const router = express.Router();

const { login, register } = require('../controller/auth');

const { loginSchema, registerSchema } = require('../schema/auth.schema');

const { globalValidateBody } = require('../validate/global.validate');

router
  .post('/login', globalValidateBody(loginSchema), login)
  .post('/register', globalValidateBody(registerSchema), register);

module.exports = router;
