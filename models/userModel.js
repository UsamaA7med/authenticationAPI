const mongoose = require("mongoose");
const joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please provide a first name"],
    },
    lastname: {
      type: String,
      required: [true, "Please provide a second name"],
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

const validateRegisterUser = (user) => {
  const schema = joi.object({
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(user);
};

const validateLoginUser = (user) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(user);
};

module.exports = { User, validateRegisterUser, validateLoginUser };
