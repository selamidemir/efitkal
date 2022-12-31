const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

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
}

exports.register = async (req, res) => {
  try {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) throw new Error("Some fields is wrong.");
    const userInfo = {
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      userType: req.body.userType,
    };
    console.log(userInfo);
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
        };
        req.session.user = userInfo;
        req.session.userIN = true;
        console.log("locals : ", res.locals)
        // res.redirect("/users/" + user._id);
        res.redirect("/")
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
