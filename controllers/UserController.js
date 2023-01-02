const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const Course = require("../models/Course");

const User = require("../models/User");

exports.getLogin = (req, res) => {
  res.render("login", { title: "Login - EFitKal", pageName: "login" });
};

exports.getRegister = (req, res) => {
  res.render("register", {
    title: "Register - EFitKal",
    pageName: "register",
    error: "",
  });
};

exports.getLogout = async (req, res) => {
  req.session.user = null;
  req.session.userIN = false;
  res.redirect("/");
};

exports.register = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) throw new Error("Some fields is wrong.");
    const userInfo = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      userType: req.body.userType,
    };
    await User.create(userInfo);
    res.status(200).redirect("/users/login");
  } catch (err) {
    res.status(400).render("register", {
      title: "Register - EFitKal",
      pageName: "register",
      error: err,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result) throw new Error("Some fiels are wrong.");
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("The email address is not registered.");
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (result) {
        const userInfo = {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          courses: user.courses,
        };
        req.session.user = userInfo;
        req.session.userIN = true;
        res.redirect("/");
      } else {
        res.status(400).render("login", {
          title: "Login - EFitKal",
          pageName: "login",
          error: "User not found.",
        });
      }
    });
  } catch (err) {
    res.status(400).render("login", {
      title: "Login - EFitKal",
      pageName: "login",
      error: err,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const user = await User.findById(req.session.user.id);
    const course = await Course.findById(courseID);
    if (course) {
      if (!user.courses.includes(course)) {
        user.courses.push(courseID);
        await user.save();
      }
    }
    res.redirect("/courses/" + courseID);
  } catch (err) {
    console.log(err);
    res.redirect("/courses");
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const courseID = req.params.courseID;
    const user = await User.findById(req.session.user.id);
    const course = await Course.findById(courseID);
    const userEnrolled = user.courses.includes(courseID);
    if (course && userEnrolled) {
      const courseIndex = user.courses.indexOf(courseID);
      user.courses.splice(courseIndex, 1);
      await user.save();
    }
    res.redirect("/courses/" + courseID);
  } catch (err) {
    console.log(err);
    res.redirect("/courses");
  }
};

exports.dashboard = async = async (req, res) => {
  try {
    const user = req.session.user;
    const userDB = await User.findById(user.id).populate("courses");
    const courses = user.userType === 'instructor' 
      ? await Course.find({ instructor: userDB._id})
      : userDB.courses;
    res.render("dashboard", {
      title: "User Dashboard - EFitKal",
      pageName: "dashboard",
      courses,
      error: "",
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
}
