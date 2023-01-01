const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileupload = require("express-fileupload");
const methodOverride = require("method-override");

const pageRouter = require("./routes/page");
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");

const app = express();

dotenv.config();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());
app.use(methodOverride("_method"));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.APP_MONGO_FULL_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.APP_MONGO_DB_NAME,
  })
  .catch((err) => {
    throw err;
  });

// session aç
app.use(
  session({
    secret: process.env.APP_SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.APP_MONGO_FULL_URL,
      dbName: process.env.APP_MONGO_DB_NAME,
    }),
  })
);

/* Eğer oturum açılmış ise oturum bilgilerini ayarla */
app.use(function (req, res, next) {
  if (req.session.userIN) {
    const userInfo = {
      id: req.session.user._id,
      name: req.session.user.name,
      email: req.session.user.email,
      slug: req.session.user.slug,
      userType: req.session.user.userType,
    };
    res.locals.user = userInfo;
    res.locals.userIN = true;
  } else {
    res.locals.user = null;
    res.locals.userIN = null;
  }
  next();
});

// Route bilgilerini girelim.
app.use("/", pageRouter);
app.use("/users", userRouter);
app.use("/courses", courseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app
module.exports = app;
