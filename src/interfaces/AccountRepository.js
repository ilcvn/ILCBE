class AccountRepository {
  async create(data) {
    throw new Error("Method not implemented");
  }

  async findByUserName(userName) {
    throw new Error("Method not implemented");
  }

  async updateAccessToken(userName, accessToken) {
    throw new Error("Method not implemented");
  }

  async delete(userName) {
    throw new Error("Method not implemented");
  }

  async update(id, updateData) {
    throw new Error("Method not implemented");
  }

  async findById(id) {
    throw new Error("Method not implemented");
  }

  async findAccountByAccesstoken(token) {
    throw new Error("Method not implemented");
  }

  async dynamicSearch(skip = 0, limit = 20, query) {
    throw new Error("Method not implemented");
  }

  async getTotalByDynamicQuery(query) {
    throw new Error("Method not implemented");
  }
}

module.exports = AccountRepository;
