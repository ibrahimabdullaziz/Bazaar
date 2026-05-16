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
    oldInput: { email: "", password: "" }
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errorMessage: "this user not found!",
          oldInput: { email: email, password: password }
        });
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
            if (err) console.log(err);
            return res.redirect("/");
          });
        }
        return res.render("auth/login", {
          pageTitle: "login",
          path: "/login",
          errorMessage: "password is wrong!",
          oldInput: { email: email, password: password }
        });
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
      return res.render("auth/login", {
        pageTitle: "login",
        path: "/login",
        errorMessage: "something got wrong!!",
        oldInput: { email: email, password: password }
      });
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
    oldInput: { name: "", email: "", password: "", confirmPassword: "", role: "guest" }
  });
};

exports.postSignup = async (req, res) => {
  console.log(req.body);
  const { name, password, email, role, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/signup", {
      pageTitle: "signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { name: name, email: email, password: password, confirmPassword: confirmPassword, role: role }
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
