const express = require("express");
const PagesController = require("../controllers/PageController");
const router = express.Router();

router.get("/", PagesController.getHome);
router.get("/about", PagesController.getAbout);
router.get("/contact", PagesController.getContact);
router.get("/pricing", PagesController.getPrincing);
router.get("/services", PagesController.getServices);
router.get("/trainer", PagesController.getTrainer);

module.exports = router;
