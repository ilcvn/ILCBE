const AppError = require("../../utils/AppError");
const generateId = require("../../utils/IDGenerator");
const PasswordHasher = require("../../utils/PasswordHasher");

class CreateAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async executed(data) {
    const passwordHasher = new PasswordHasher();
    const hashedPassword = await passwordHasher.hash(data.password);

    let id;
    let isIdUnique = false;
    while (!isIdUnique) {
      id = generateId(6);
      const existingUserWithId = await this.accountRepository.findById(id);

      if (!existingUserWithId) {
        isIdUnique = true;
      }
    }
    const account = {
      ...data,
      id,
      hashedPassword,
    };

    const existingUser = await this.accountRepository.findByUserName(
      data.userName
    );

    if (existingUser) {
      throw new AppError("Tên đăng nhập đã tồn tại", 400);
    }

    const createdUser = await this.accountRepository.create(account);
    return createdUser;
  }
}

module.exports = CreateAccount;
