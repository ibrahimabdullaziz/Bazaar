module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return redirect("/login");
  }
  next();
};
