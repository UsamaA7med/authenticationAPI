const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { getUsers } = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.get("/", verifyToken, getUsers);

module.exports = userRouter;
