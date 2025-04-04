const AppError = require("../../utils/AppError");

class DeleteAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async executed(id) {
    const existingUser = await this.accountRepository.findById(id);

    if (!existingUser) {
      throw new AppError("Account does not exist", 404);
    }

    if (existingUser.role === "GLOBAL_ADMIN") {
      throw new AppError("Không thể xóa tài khoản Quản trị hệ thống", 404);
    }

    const result = await this.accountRepository.delete(id);
    return result;
  }
}

module.exports = DeleteAccount;
