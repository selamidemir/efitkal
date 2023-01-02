const express = require("express");

const { instructorCheck } = require("../middlewares/auth");
const CourseController = require("../controllers/CourseController");

const router = express.Router();

router.get("/", CourseController.courses);
router.get("/add", instructorCheck, CourseController.add);
router.get("/:id", CourseController.getCourse);
router.get("/edit/:id", instructorCheck, CourseController.edit);
router.delete("/:id", instructorCheck, CourseController.delete);
router.post("/", instructorCheck, CourseController.create);
router.put("/:id", instructorCheck, CourseController.update)

module.exports = router;
