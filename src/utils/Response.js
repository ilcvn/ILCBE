const sendResponse = (res, statusCode, message, status, data) => {
  res.status(statusCode).json({
    status,
    message,
    data,
    statusCode,
  });
};

module.exports = sendResponse;
