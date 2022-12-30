/* Kurs bilgilerinin tutulacağı
Mongoose modelini tanımlıyoruz. */

const mongoose = require("mongoose");

const Schema = mongoose.mongoose.Schema;
const CouseSchema = Schema({
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
});

const Couse = mongoose.Model("Course", CouseSchema);

module.exports = Couse;
