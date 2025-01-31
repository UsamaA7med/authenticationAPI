const jwt = require("jsonwebtoken");
module.exports = (id, email) => {
  const accessToken = jwt.sign(
    { id: id, email: email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15s",
    }
  );
  const refreshToken = jwt.sign(
    { id: id, email: email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};
