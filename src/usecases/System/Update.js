const AppError = require("../../utils/AppError");

class UpdateSystem {
  constructor(systemRepository) {
    this.systemRepository = systemRepository;
  }

  async executed(updateData) {
    delete updateData.id;

    const updatedSystem = await this.systemRepository.update(updateData);
    return updatedSystem;
  }
}

module.exports = UpdateSystem;
