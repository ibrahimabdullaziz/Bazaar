const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  role: {
    type: String,
    enum: ["host", "guest"],
    default: "guest",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
