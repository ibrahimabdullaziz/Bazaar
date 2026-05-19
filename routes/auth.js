const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const authController = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Ensure you entered email in right formatting!")
      .normalizeEmail({
        gmail_remove_dots: false,
        gmail_remove_subaddress: false,
      }),

    body("password")
      .trim()
      .isLength({ min: 4 })
      .isAlphanumeric()
      .withMessage("password should be at least 4 characters"),
  ],
  authController.postLogin,
);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Ensure you entered email in right formatting!")
      .normalizeEmail({
        gmail_remove_dots: false,
        gmail_remove_subaddress: false,
      })
      .custom((value) => {
        return User.findOne({ email: value }).then((UserDoc) => {
          if (UserDoc) {
            return Promise.reject("this email is already exists!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .isAlphanumeric()
      .withMessage("password should be at least 4 characters"),

    body("confirmPassword").custom((value, { req }) => {
      if (value != req.body.password) {
        return Promise.reject("passwords should match!");
      }
    }),
  ],
  authController.postSignup,
);
router.post("/logout", isAuth, authController.postLogout);

module.exports = router;
