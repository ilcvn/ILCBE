class ArticleRepository {
  async create(data) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async update(id, updateData) {
    throw new Error("Method not implemented");
  }

  async delete(id) {
    throw new Error("Method not implemented");
  }

  async findAll() {
    throw new Error("Method not implemented");
  }

  async getLastId() {
    throw new Error("Method not implemented");
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    throw new Error("Method not implemented");
  }

  async getTotalByDynamicQuery(query) {
    throw new Error("Method not implemented");
  }
}

module.exports = ArticleRepository;
