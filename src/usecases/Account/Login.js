const AppError = require("../../utils/AppError");
const PasswordHasher = require("../../utils/PasswordHasher");
const TokenGenerator = require("../../utils/TokenGenerator");

class Login {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async login(userName, password) {
    const account = await this.accountRepository.findByUserName(userName);
    if (!account) {
      throw new AppError("Tên tài khoản hoặc mật khẩu không đúng", 404);
    }

    if (account.status !== "active") {
      throw new AppError("Banned Account", 400);
    }

    const passwordHasher = new PasswordHasher();
    const isPasswordValid = await passwordHasher.compare(
      password,
      account.hashedPassword
    );

    if (!isPasswordValid) {
      throw new AppError("Name or password are wrong", 404);
    }

    const accessToken = TokenGenerator.generateAccessToken(
      userName,
      account.role
    );

    await this.accountRepository.updateAccessToken(userName, accessToken);

    return accessToken;
  }
}

module.exports = Login;
