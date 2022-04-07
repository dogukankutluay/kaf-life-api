const yup = require('yup');

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
const registerSchema = yup.object({
  email: yup.string().email().required(),
  phone: yup.string().max(10).min(10).required(),
  password: yup.string().required().max(15).min(5),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null]),
});
const confirmPhoneSchema = yup.object({
  phone: yup.string().max(10).min(10).required(),
  code: yup.string().max(4).min(4).required(),
});

module.exports = {
  loginSchema,
  registerSchema,
  confirmPhoneSchema,
};
