const AppError = require("../../utils/AppError");
const PasswordHasher = require("../../utils/PasswordHasher");

class UpdateAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async executed(id, updateData) {
    const existingUser = await this.accountRepository.findById(id);

    if (!existingUser) {
      throw new AppError("Account does not exist", 404);
    }

    if (updateData.password) {
      const passwordHasher = new PasswordHasher();
      const hashedPassword = await passwordHasher.hash(updateData.password);
      updateData.hashedPassword = hashedPassword;
    }

    if (
      updateData.role &&
      !["GLOBAL_ADMIN", "IT_TECHNICIAN", "ADMIN"].includes(updateData.role)
    ) {
      throw new AppError("Role does not exist", 404);
    }

    if (
      updateData.status &&
      !["active", "unactive"].includes(updateData.status)
    ) {
      throw new AppError("Status does not exist", 404);
    }

    delete updateData.username;
    delete updateData.id;
    delete updateData.password;

    const updatedAccount = await this.accountRepository.update(id, updateData);
    return updatedAccount;
  }
}

module.exports = UpdateAccount;
