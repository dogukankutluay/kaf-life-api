const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { successReturn, errorReturn } = require('../helpers/CustomReturn');
const login = asyncHandler(async (req, res, next) => {
  const body = req.body;
  try {
    return successReturn(res, { token: '' });
  } catch (error) {
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});
const register = asyncHandler(async (req, res, next) => {
  try {
    return successReturn(res, {
      message: 'Kayıt başarılı, sms ile gelen mesajı hesabını doğrulayınız.',
    });
  } catch (error) {
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});
const confirmPhone = asyncHandler(async (req, res, next) => {
  const { code, phone } = req.query;

  try {
    const user = await User.findOne({ phone, phoneConfirmCode: code });
    if (!user)
      return errorReturn(res, {
        message: 'Kullanıcı bulunamadı.',
      });

    user.isPhoneConfirm = true;
    user.phoneConfirmCode = undefined;

    await user.save();
    const token = user.generateTokenJwt();

    return successReturn(res, {
      token,
    });
  } catch (error) {
    return errorReturn(res, {
      error: error || error.message,
    });
  }
});

module.exports = {
  login,
  register,
  confirmPhone,
};
