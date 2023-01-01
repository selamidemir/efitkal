/* Kurs bilgilerinin tutulacağı
Mongoose modelini tanımlıyoruz. */

const mongoose = require("mongoose");

const Schema = mongoose.mongoose.Schema;
const CourseSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  photo: {
    type: String,
    require: true
  },
  instructer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
