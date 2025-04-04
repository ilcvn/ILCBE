const AppError = require("../../utils/AppError");

class UpdateEcosystem {
  constructor(EcosystemRepository) {
    this.ecosystemRepository = EcosystemRepository;
  }

  async executed(id, updateData) {
    const existingEcosystem = await this.ecosystemRepository.findById(id);

    if (!existingEcosystem) {
      throw new AppError("Ecosystem does not exist", 404);
    }

    delete updateData.id;

    const updatedEcosystem = await this.ecosystemRepository.update(id, updateData);
    return updatedEcosystem;
  }
}

module.exports = UpdateEcosystem;
