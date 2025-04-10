const AppError = require("../../utils/AppError");

class CreateSystem {
  constructor(systemRepository) {
    this.systemRepository = systemRepository;
  }

  async executed(data) {
    const system = {
      ...data,
      id: 1,
    };

    const existingSystemWithId = await this.systemRepository.getSystemInfo(
      data?.id
    );

    if (existingSystemWithId) return;

    const createdSystem = await this.systemRepository.create(system);
    return createdSystem;
  }
}

module.exports = CreateSystem;
