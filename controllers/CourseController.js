const fs = require("fs");
const { validationResult } = require("express-validator");
const Course = require("../models/Course");
const User = require("../models/User");

exports.courses = async (req, res) => {
  try {
    const filtre = {};
    const courses = await Course.find(filtre)
      .populate("instructer")
      .sort({ createdAt: -1 });
    res.render("course", {
      title: "Courses - EFitKal",
      pageName: "courses",
      courses,
      error: "",
    });
  } catch (err) {
    res.redirect("/");
  }
};

exports.getCourse = async (req, res) => {
  try {
    const courseID = req.params.id;
    const course = await Course.findById(courseID);
    const user = await User.findById(req.session.user.id);
    if (course && user) {
      const enrolled = user.courses.includes(courseID);
      res.render("course_single", {
        title: course.name,
        pageName: "course",
        course,
        enrolled,
        error: "",
      });
    } else res.redirect("/courses");
  } catch (err) {
    console.log("HATA : ", err)
    res.redirect("/");
  }
};

exports.create = (req, res) => {
  try {
    const result = validationResult(req);
    const file = req.files.photo;
    const path = process.cwd() + "/public/uploads";
    if (!result.isEmpty || !file) throw new Error("Some fields are wrong.");
    console.log(path);
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
        photo: file.name,
      };
      await Course.create(courseInfo);
    });
    res.status(200).redirect("/courses");
  } catch (err) {
    console.log(err);
    res.status(400).render("add_course", {
      title: "Add A New Course - EFitKal",
      pageName: "add-course",
      error: err,
    });
  }
};

exports.update = async (req, res) => {};

exports.delete = async (req, res) => {
  res.send("delete")
};

exports.add = (req, res) => {
  res.status(200).render("add_course", {
    title: "Add A New Course - EFitKal",
    pageName: "add-course",
    error: "",
  });
};

exports.edit = (req, res) => {
  res.send(req.params.id)
};
