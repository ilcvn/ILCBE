const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.USER_SERVICE_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CORS_ORIGIN: process.env.CORS_ORIGIN,

  GLOBAL_ADMIN: process.env.GLOBAL_ADMIN || "GLOBAL_ADMIN",
  IT_TECHNICIAN: process.env.IT_TECHNICIAN || "IT_TECHNICIAN",
  ADMIN: process.env.ADMIN || "ADMIN",
};
