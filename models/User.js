/* Kullanıcı bilgilerin tutulacağı Mongoose 
modelini tanımlıyoruz. */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Course = require("./Course");

const Schema = mongoose.Schema;
const UserSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  userType: {
    type: String,
    default: "user",
    require: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) next(err);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
