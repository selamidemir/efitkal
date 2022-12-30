/* Kullanıcı bilgilerin tutulacağı Mongoose 
modelini tanımlıyoruz. */

const mongoose = require("mongoose");
const UserTypes = require("../asserts");

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
    trim: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  courses: [Course],
});


const User = mongoose.Model("User", UserSchema);

module.exports = User;
