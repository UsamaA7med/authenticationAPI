const asyncMiddleware = require("../middlewares/asyncMiddleware");
const { User } = require("../models/userModel");

const getUsers = asyncMiddleware(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ status: "success", data: users });
});

module.exports = { getUsers };
