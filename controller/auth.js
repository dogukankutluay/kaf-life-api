const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const aes256 = require('aes256');
const { successReturn, errorReturn } = require('../helpers/CustomReturn');
const { comparePassword } = require('../helpers/inputController');
const login = asyncHandler(async (req, res, next) => {
  const { email, phone, password } = req.body;
  let fIn = {};
  email ? (fIn.email = email) : (fIn.phone = phone);
  let eM = 'not found user';
  try {
    const fUser = await User.findOne(fIn);
    if (!fUser) return errorReturn(res, { message: eM });
    if (!comparePassword(password, fUser.password))
      return errorReturn(res, { message: eM });
    if (fUser.status !== 'Approve') return errorReturn(res, { message: eM });
    if (fUser.registerAccess.confirm !== true)
      return errorReturn(res, { message: eM });

    const key = '49951b24-8261-4020-87c5-2512bb6060be';
    const plaintext = fUser.phone + fUser.name + fUser.surname;
    const encryptedPlainText = aes256.encrypt(key, plaintext);
    const redirect = `https://www.firsatlarkulubu.com/ServiceLoginWithToken?token=${encryptedPlainText}`;
    let result =
      fUser.role === 'Admin'
        ? { token: fUser.generateTokenJwt() }
        : { redirect };
    return successReturn(res, { ...result });
  } catch (error) {
    console.log(error);

    return errorReturn(res, {
      error: error || eM,
    });
  }
});
const register = asyncHandler(async (req, res, next) => {
  const body = req.body;
  const eM = 'was a problem creating the user';
  try {
    const user = await User.create(body);
    if (!user) return errorReturn(res, { message: eM });
    const sendSms = user.sendSmsForRegisterConfirmation();
    await user.save();
    if (!sendSms) return errorReturn(res, { message: 'sms could not be sent' });
    return successReturn(res, {
      user: {
        phone: user.phone,
      },
      message: 'code sent for confirmation',
    });
  } catch (error) {
    return errorReturn(res, {
      error: error || eM,
    });
  }
});
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  let eM = 'not found user';
  try {
    const fUser = await User.findOne({ email });
    if (!fUser) return errorReturn(res, { message: eM });
    if (fUser?.forgotPassword?.confirm === false)
      return errorReturn(res, { message: 'there is already an sms sent' });
    const sendSms = fUser.sendSmsForForgotPasswordConfirmation();
    if (!sendSms) return errorReturn(res, { message: 'sms could not be sent' });
    await fUser.save();
    return successReturn(res, {
      user: { phone: fUser.phone, email: fUser.email },
    });
  } catch (error) {
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});
const confirmRegister = asyncHandler(async (req, res, next) => {
  const { code, phone } = req.query;
  let eM = 'not found user';

  try {
    const fUser = await User.findOneAndUpdate(
      { 'registerAccess.code': code, phone },
      {
        'registerAccess.confirm': true,
        'registerAccess.code': '',
      }
    );
    if (!fUser) return errorReturn(res, { message: eM });
    return successReturn(res, {});
  } catch (error) {
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});
const confirmForgotPassword = asyncHandler(async (req, res, next) => {
  const { code, phone } = req.query;
  let eM = 'not found user';

  try {
    const fUser = await User.findOneAndUpdate(
      { 'forgotPassword.code': code, phone },
      {
        'forgotPassword.confirm': true,
      }
    );
    if (!fUser) return errorReturn(res, { message: eM });
    return successReturn(res, {});
  } catch (error) {
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});
const changePassword = asyncHandler(async (req, res, next) => {
  const { code, password } = req.body;
  let eM = 'not found user';

  try {
    const fUser = await User.findOne({ 'forgotPassword.code': code });

    if (!fUser) return errorReturn(res, { message: eM });
    fUser.forgotPassword.code = '';
    fUser.password = password;
    await fUser.save();
    return successReturn(res, {});
  } catch (error) {
    console.log(error);
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});

module.exports = {
  login,
  register,
  forgotPassword,
  confirmRegister,
  confirmForgotPassword,
  changePassword,
};
