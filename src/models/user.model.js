const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Enter your first name"],
    },
    last_name: {
      type: String,
      required: [true, "Enter your last name"],
    },
    birth_date: {
      type: Date,
      required: [true, "Enter your birth date"],
    },
    email: {
      type: String,
      required: [true, "Enter an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
      select: false,
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
    },
    is_admin: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      type: String,
    },
    phone_number: {
      type: String,
      required: [true, "Enter your phone number"],
      unique: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const user = mongoose.model("user", userModel);
module.exports = user;
