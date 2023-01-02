const express = require("express");

const { instructorCheck } = require("../middlewares/auth");
const CourseController = require("../controllers/CourseController");

const router = express.Router();

router.get("/", CourseController.courses);
router.get("/add", CourseController.add);
router.get("/:id", CourseController.getCourse);
router.get("/edit/:id", CourseController.edit);
router.delete("/:id", CourseController.delete);
router.post("/", CourseController.create);
router.put("/:id", instructorCheck, CourseController.update)

module.exports = router;
