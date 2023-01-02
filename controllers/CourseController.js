const fs = require("fs");
const { validationResult } = require("express-validator");
const Course = require("../models/Course");
const User = require("../models/User");

exports.courses = async (req, res) => {
  try {
    const filtre = {};
    const courses = await Course.find(filtre)
      .populate("instructor")
      .sort({ createdAt: -1 });
    res.render("course", {
      title: "Courses - EFitKal",
      pageName: "courses",
      courses,
      error: "",
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.getCourse = async (req, res) => {
  try {
    const courseID = req.params.id;
    const course = await Course.findById(courseID);
    const user = req.session.user
      ? await User.findById(req.session.user.id)
      : false;
    if (course) {
      const enrolled = user ? user.courses.includes(courseID) : false;
      console.log(user)
      res.render("course_single", {
        title: course.name,
        pageName: "course",
        course,
        enrolled,
        error: "",
      });
    } else res.redirect("/courses");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

exports.create = (req, res) => {
  try {
    const result = validationResult(req);
    const file = req.files.photo;
    const path = process.cwd() + "/public/uploads";
    if (!result.isEmpty || !file) throw new Error("Some fields are wrong.");
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
        instructor: user._id,
        photo: file.name,
      };
      await Course.create(courseInfo);
      res.status(200).redirect("/courses");
    });
  } catch (err) {
    console.log(err);
    res.status(400).render("add_course", {
      title: "Add A New Course - EFitKal",
      pageName: "add-course",
      error: err,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const result = validationResult(req);
    const courseID = req.params.id;
    const course = await Course.findById(courseID);
    if (!course) throw new Error("No course finded.");

    const file = req.files === null ? false : req.files.photo;
    const path = process.cwd() + "/public/uploads";
    if (!result.isEmpty) throw new Error("Some fields are wrong.");
    if (!fs.existsSync(path))
      fs.mkdir(path, (err) => {
        if (err) {
          throw err;
        }
      });
    if (file) {
      file.mv(path + "/" + file.name, async (err) => {
        if (err) throw new Error("File does not uploaded.");

        course.name = req.body.name;
        course.description = req.body.description;
        course.price = req.body.price;
        course.photo = file.name;

        await course.save();
        res.status(200).redirect("/courses");
      });
    } else {
      course.name = req.body.name;
      course.description = req.body.description;
      course.price = req.body.pric;
      await course.save();
      res.status(200).redirect("/courses");
    }
  } catch (err) {
    console.log(err);
    res.status(400).render("add_course", {
      title: "Add A New Course - EFitKal",
      pageName: "add-course",
      error: err,
    });
  }
};

exports.delete = async (req, res) => {
  const courseID = req.params.id;
  try {
    await Course.findByIdAndRemove(courseID);
    res.redirect("/courses");
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/courses");
  }
};

exports.add = (req, res) => {
  res.status(200).render("add_course", {
    title: "Add A New Course - EFitKal",
    pageName: "add-course",
    course: null,
    error: "",
  });
};

exports.edit = async (req, res) => {
  const courseID = req.params.id;
  try {
    const course = await Course.findById(courseID);
    console.log(course);
    res.status(200).render("add_course", {
      title: "Edit The Course - EFitKal",
      pageName: "add-course",
      course,
      error: "",
    });
  } catch (err) {
    console.log(err);
    res.status(500).redirect("/courses");
  }
};
