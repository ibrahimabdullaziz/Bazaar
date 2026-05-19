exports.getChalet = (req, res) => {
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("", {
    pageTitle: "add chalet",
    path: "/add-chalet",
    errorMessage: message,
    oldInput: {},
  });
};
exports.postChalet = (req, res) => {};
