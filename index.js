const express = require("express");
const connectToDataBase = require("./config/connectToDataBase");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

require("dotenv").config();

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./views/404.html"));
});

app.use((error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({ status: error.status || "error", message: error.message });
});

app.listen(process.env.PORT_NUMBER, () => {
  console.log(`Server is running on port ${process.env.PORT_NUMBER}`);
});

connectToDataBase();
