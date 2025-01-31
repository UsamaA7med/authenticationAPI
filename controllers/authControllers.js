const asyncMiddleware = require("../middlewares/asyncMiddleware");
const jwt = require("jsonwebtoken");
const {
  validateRegisterUser,
  User,
  validateLoginUser,
} = require("../models/userModel");
const generateError = require("../utils/generateError");
const bcrypt = require("bcryptjs");
const generateTokens = require("../utils/generateTokens");

const Register = asyncMiddleware(async (req, res, next) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const emailexists = await User.findOne({ email: req.body.email });
  if (emailexists) {
    const Eerror = generateError("Email already exists", "fail", 400);
    return next(Eerror);
  }
  const usernameexists = await User.findOne({ username: req.body.username });
  if (usernameexists) {
    const Eerror = generateError("Username already exists", "fail", 400);
    return next(Eerror);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, password: hashedPassword });
  const { accessToken, refreshToken } = generateTokens(user._id, user.email);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ status: "success", data: user, accessToken });
});

const Login = asyncMiddleware(async (req, res, next) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    const Eerror = generateError(error.details[0].message, "fail", 400);
    return next(Eerror);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const Eerror = generateError("Invalid email or password", "fail", 400);
    return next(Eerror);
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    const Eerror = generateError("Invalid email or password", "fail", 400);
    return next(Eerror);
  }
  const { accessToken, refreshToken } = generateTokens(user._id, user.email);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res
    .status(200)
    .json({ status: "success", message: "login successfuly", accessToken });
});

const Refresh = asyncMiddleware(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    const Eerror = generateError("You are not authorized", "fail", 401);
    return next(Eerror);
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    const Eerror = generateError("User not found", "fail", 404);
    return next(Eerror);
  }
  const { accessToken } = generateTokens(user._id, user.email);
  res.status(200).json({ status: "success", accessToken });
});

const Logout = asyncMiddleware(async (req, res, next) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ status: "success", message: "logout successfully" });
});

module.exports = { Register, Login, Refresh, Logout };
