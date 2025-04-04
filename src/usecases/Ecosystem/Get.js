const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");

class GetEcosystem {
  constructor(ecosystemRepository) {
    this.ecosystemRepository = ecosystemRepository;
  }

  async getEcosystemById(id) {
    const ecosystem = await this.ecosystemRepository.findById(id);
    if (!ecosystem) {
      throw new AppError("Ecosystem does not exist", 404);
    }
    return ecosystem;
  }

  async searchEcosystem(page = 1, limit = 20, query) {
    const { skip, limit: paginatedLimit } = paginate({}, page, limit);

    const ecosystems = await this.ecosystemRepository.dynamicSearch(
      skip,
      paginatedLimit,
      query
    );

    const total = await this.ecosystemRepository.getTotalByDynamicQuery(query);

    return {
      Ecosystems: await this.listEcosystems(ecosystems),
      pagination: {
        page: parseInt(page),
        limit: paginatedLimit,
        total,
      },
    };
  }

  async listEcosystems(Ecosystems) {
    return Ecosystems.map((Ecosystem) => {
      const EcosystemObject = Ecosystem.toObject();
      delete EcosystemObject._id;
      delete EcosystemObject.__v;
      return {
        ...EcosystemObject,
      };
    });
  }
}

module.exports = GetEcosystem;
