const fs = require("fs")
const { validationResult } = require("express-validator");
const Course = require("../models/Course");
const User = require("../models/User");

exports.courses = async (req, res) => {
  res.send("courses");
};

exports.getCourse = async (req, res) => {
  res.send("get course");
};

exports.create = (req, res) => {
    console.log("İŞLEM BAŞLADI")
  try {
    const result = validationResult(req);
    const file = req.files.photo;
    const path = process.cwd() + "/public/uploads";
    if (!result.isEmpty || !file) throw new Error("Some fields are wrong.");
    console.log(path)
    if (!fs.existsSync(path))
        fs.mkdir(path, (err) => {
          if (err) {
            throw err;
          }
        });
    file.mv(path + "/" + file.name, async (err) => {
      if (err) throw new Error("File does not uploaded.");
      const user = await User.findById(req.session.user.id);
      const courseInfo = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        instructer: user._id,
        photo: file.name
      };
      await Course.create(courseInfo);
    });
    res.status(200).redirect("/courses");
  } catch (err) {
    console.log(err)
    res
      .status(400)
      .render("add_course", {
        title: "Add A New Course - EFitKal",
        pageName: "add-course",
        error: err,
      });
  }
};

exports.update = async (req, res) => {};

exports.delete = async (req, res) => {};

exports.add = (req, res) => {
  res
    .status(200)
    .render("add_course", {
      title: "Add A New Course - EFitKal",
      pageName: "add-course",
      error: "",
    });
};

exports.edit = (req, res) => {};
