const express = require("express");
const { body } = require("express-validator");

const UserController = require("../controllers/UserController");
const { DefaultUserTypes } = require("../asserts/UserTypes");
const User = require("../models/User");
const { userCheck } = require("../middlewares/auth");

const router = express.Router();
/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

/* POST register user */
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Enter the name!"),
    body("email")
      .isEmail()
      .withMessage("Enter correct email address!")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) throw new Error("The email adress already registered.");
      }),
    body("password").trim().not().isEmpty().withMessage("Enter the password!"),
    body("userType")
      .isLength({ min: 4 })
      .withMessage("The password length must be at least 5"),
  ],
  UserController.register
);

/* POST login user */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter correct email."),
    body("password").not().isEmpty().withMessage("Enter password."),
  ],
  UserController.loginUser
);

/* Register user page */
router.get("/register", userCheck, UserController.getRegister);

/* Login user page */
router.get("/login", userCheck, UserController.getLogin);

/* Logout user */
router.get("/logout", UserController.getLogout);


module.exports = router;
