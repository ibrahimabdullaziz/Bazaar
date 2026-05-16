const { validationResult } = require("express-validator");
const User = require("../models/user");
const crypt = require("bcrypt");

exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "this user not found!");
        return res.redirect("/login");
      }

      return crypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          //sessions logic
          req.session.isLoggedIn = true;
          req.session.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
          return req.session.save((err) => {
            req.flash("error", "session didn`t saved!");
            return res.redirect("/");
          });
        }
        req.flash("error", "password is wrong!");
        return res.redirect("/login");
      });
    })
    .catch((err) => {
      if (err) {
        req.flash("error", "something get wrong!!");
      }
      return res.redirect("/login");
    });
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    pageTitle: "signup",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignup = async (req, res) => {
  console.log(req.body);
  const { name, password, email, role } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/signup", {
      pageTitle: "signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  try {
    const newUser = new User({ name, password, email, role });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "Failed at creating new user!");
    return res.redirect("/login");
  }
  console.log("USER ADDED SUCCESSFULLY!");
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
