const jwt = require("jsonwebtoken");
const config = require("../configs/config");

class TokenGenerator {
  static generateAccessToken(userName, role) {
    const payload = { userName, role };
    const options = { expiresIn: "1d" };
    return jwt.sign(payload, config.JWT_SECRET, options);
  }
}

module.exports = TokenGenerator;
