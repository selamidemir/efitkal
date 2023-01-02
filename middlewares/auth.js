const { UserTypes } = require("../asserts/UserTypes");

exports.userCheck = (req, res, next) => {
  if (res.locals.userIN) next();
  else res.status(400).redirect("/");
};

exports.instructorCheck = (req, res, next) => {
  if (
    res.locals.userIN &&
    (res.locals.user.userType === UserTypes.instructor)
  )
    next();
  else res.status(400).redirect("/");
};
