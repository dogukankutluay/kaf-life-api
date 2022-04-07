const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
