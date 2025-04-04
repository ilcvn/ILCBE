const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");

class GetSystem {
  constructor(systemRepository) {
    this.systemRepository = systemRepository;
  }

  async getSystem() {
    const system = await this.systemRepository.getSystemInfo();
    if (!system) {
      throw new AppError("System does not exist", 404);
    }
    return system;
  }
}

module.exports = GetSystem;
