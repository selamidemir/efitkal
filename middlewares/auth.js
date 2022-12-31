exports.userCheck = (req, res, next) => {
    if(!res.locals.userIN) next();
    else res.status(400).redirect("/");
}