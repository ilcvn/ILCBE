const jwt = require("jsonwebtoken");
const MongoAccountRepository = require("../repositories/mongo/MongoAccountRepository");
const sendResponse = require("../utils/Response");
const config = require("../configs/config");

const accountRepository = new MongoAccountRepository();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, 401, "unauthorized", "error", null);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const account = await accountRepository.findByUserName(decoded.userName);

    if (!account || account.accessToken !== token) {
      return sendResponse(res, 401, "invalid token", "error", null);
    }

    req.user = account;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(res, 401, "expired token", "error", null);
    }
    return sendResponse(res, 401, "invalid token", "error", null);
  }
};

const sysAdminOnly = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "GLOBAL_ADMIN" && req.user.role !== "IT_TECHNICIAN")
  ) {
    return sendResponse(res, 403, "not allow", "error", null);
  }
  next();
};

module.exports = {
  authMiddleware,
  sysAdminOnly,
};
