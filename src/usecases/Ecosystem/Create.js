class CreateEcosystem {
  constructor(ecosystemRepository) {
    this.ecosystemRepository = ecosystemRepository;
  }

  async executed(data) {
    const lastID = await this.ecosystemRepository.getLastId();
    const newId = lastID + 1;

    const ecosystem = {
      ...data,
      id: newId,
    };

    const createdEcosystem = await this.ecosystemRepository.create(ecosystem);
    return createdEcosystem;
  }
}

module.exports = CreateEcosystem;
