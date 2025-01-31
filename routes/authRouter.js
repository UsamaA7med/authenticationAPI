const express = require("express");
const {
  Register,
  Login,
  Refresh,
  Logout,
} = require("../controllers/authControllers");

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.get("/refresh", Refresh);
authRouter.get("/logout", Logout);

module.exports = authRouter;
