const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

const { hostname } = require("os");
const path = require("path");

const authRouter = require("./routes/auth");

require("dotenv").config();
const port = process.env.LISTENING_PORT;

const mongoose = require("mongoose");
const User = require("./models/user");
const MongoDBStore = require("connect-mongodb-session")(session);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(flash());

//add sessions store to save in database
const DB_Store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//create session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: DB_Store,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
    },
  }),
);

app.use(flash());

//"Mongoose Instance" Middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = false;

  if (!req.session.user) {
    return next();
  }

  res.locals.isAuthenticated = req.session.isLoggedIn;

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next();
    });
});

app.use(authRouter);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.render("index", {
    pageTitle: "Hello!",
    path: "/",
  });
});

// console.log(process.env.LISTENING_PORT);
app.listen(port, hostname, () => {
  console.log(`LISTENING ON ${hostname} ${port}`);
});
