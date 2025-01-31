const allowedOrigines = require("./allowedOrigines");

const corsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigines.includes(origin) || !origin) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
