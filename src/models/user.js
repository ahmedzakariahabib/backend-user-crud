const mongoose = require("mongoose");
const validator = require("validator");

const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      let password = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (!password.test(value)) {
        throw new Error(
          "Password must include uppercase , lowercase , numbers , speacial characters"
        );
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error("Email is INVALID");
      }
    },
  },
  age: {
    type: Number,
    default: 18,
    validate(val) {
      if (val <= 0) {
        throw new Error("age must be a positive number");
      }
    },
  },
  city: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcryptjs.hash(user.password, 8);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
