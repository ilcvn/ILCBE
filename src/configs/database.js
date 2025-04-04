const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error("MONGODB_URI không được định nghĩa trong file cấu hình");
    }
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối MongoDB thành công");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
