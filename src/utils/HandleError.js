const AppError = require("./AppError");
const sendResponse = require("./Response");

sendError = (res, error) => {
  if (error instanceof AppError) {
    return sendResponse(res, error.statusCode, error.message, "error", null);
  }
  sendResponse(
    res,
    500,
    "Đã xảy ra lỗi không xác định " + error,
    "error",
    null
  );
};

module.exports = sendError;
