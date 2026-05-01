const User = require("../models/user");
const crypt = require("bcrypt");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "login",
    path: "/login",
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      return crypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          //sessions logic
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.redirect("/login");
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

exports.postSignup = async (req, res) => {
  console.log(req.body);
  const { name, password, email, role } = req.body;
  try {
    const newUser = new User({ name, password, email, role });
    await newUser.save();
  } catch (error) {
    console.log("Failed at creating new user!");
  } finally {
    res.redirect("/login");
  }
  console.log("USER ADDED SUCCESSFULLY!");
};
