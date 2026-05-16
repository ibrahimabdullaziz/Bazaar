const mongoose = require("mongoose");
const crypt = require("bcrypt");

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
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const hashedPassword = await crypt.hash(this.password, 12);
    this.password = hashedPassword;
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("User", userSchema);
