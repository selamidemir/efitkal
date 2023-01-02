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
  photo: {
    type: String,
    require: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
