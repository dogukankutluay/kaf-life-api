const { errorReturn } = require('../helpers/CustomReturn');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const { findUserId } = require('../services/auth');
const isThereAUserAndFind = asyncHandler(async (req, res, next) => {
  const userFind = await findUserId(
    req.headers['authorization']?.split('Bearer ')[1]
  );
  const user = await User.findById(userFind._id);
  if (user && userFind._id === String(user._id)) {
    req.user = user;
    next();
  } else {
    return errorReturn(res, {
      message: 'Authentication error',
    });
  }
});
module.exports = {
  isThereAUserAndFind,
};
