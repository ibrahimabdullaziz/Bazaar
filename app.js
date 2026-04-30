const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const express = require("express");
const app = express();

const { hostname } = require("os");
const path = require("path");

const authRouter = require("./routes/auth");

require("dotenv").config();
const port = process.env.LISTENING_PORT;

const mongoose = require("mongoose");

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

//routes
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
