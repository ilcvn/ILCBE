const AppError = require("../../utils/AppError");

class DeleteEcosystem {
  constructor(ecosystemRepository) {
    this.ecosystemRepository = ecosystemRepository;
  }

  async executed(id) {
    const existingEcosystem = await this.ecosystemRepository.findById(id);

    if (!existingEcosystem) {
      throw new AppError("Ecosystem does not exist", 404);
    }

    const result = await this.ecosystemRepository.delete(id);
    return result;
  }
}

module.exports = DeleteEcosystem;
