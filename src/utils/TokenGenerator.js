const jwt = require("jsonwebtoken");
const config = require("../configs/config");

class TokenGenerator {
  static generateAccessToken(userName, role) {
    const payload = { userName, role };
    const options = { expiresIn: "2h" };
    return jwt.sign(payload, config.JWT_SECRET, options);
  }
}

module.exports = TokenGenerator;
