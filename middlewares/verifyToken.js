const generateError = require("../utils/generateError");
const asyncMiddleware = require("./asyncMiddleware");
const jwt = require("jsonwebtoken");

module.exports = asyncMiddleware(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const vefiyedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!vefiyedToken) {
    const error = generateError(
      "You are not authorized to access this route",
      "fail",
      401
    );
    return next(error);
  }
  req.user = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
  next();
});
