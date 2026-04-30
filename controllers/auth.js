const User = require("../models/user");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "login",
    path: "/login",
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.find({ email: email, password: password })
    .then((user) => {
      res.render("index", {
        pageTitle: "Hello!",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    path: "/signup",
  });
};

exports.postSignup = (req, res) => {
  console.log(req.body);
  const { name, password, email, role } = req.body;
  try {
    const newUser = new User({ name, password, email, role });
    newUser.save();
  } catch (error) {
    console.log("Failed at creating new user!");
  } finally {
    res.redirect("/login");
  }
  console.log("USER ADDED SUCCESSFULLY!");
};
