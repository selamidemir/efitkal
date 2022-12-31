exports.getHome = async (req, res) => {
  res.render("index", { title: "Home", pageName: "home" });
};

exports.getAbout = (req, res) => {
  res.render("about", { title: "About Us - EFitKal", pageName: "about" });
};

exports.getContact = (req, res) => {
  res.render("contact", { title: "Contact Us - EFitKal", pageName: "contact" });
};

exports.getPrincing = (req, res) => {
  res.render("pricing", { title: "Pricing - EFitKal", pageName: "pricing" });
};

exports.getServices = (req, res) => {
  res.render("services", { title: "Services - EFitKal", pageName: "services" });
};

exports.getTrainer = (req, res) => {
  res.render("trainer", { title: "Trainer - EFitKal", pageName: "trainer" });
};

