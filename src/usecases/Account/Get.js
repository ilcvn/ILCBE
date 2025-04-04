const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");

class GetAccount {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async getAccountById(id) {
    const account = this.accountRepository.findAccountById(id);
    if (!account) {
      throw new AppError("Account does not exist", 404);
    }
    return account;
  }

  async getAccountByToken(token) {
    const account = await this.accountRepository.findAccountByAccesstoken(
      token
    );
    if (!account) {
      throw new AppError("Account does not exist", 404);
    }
    return account;
  }

  async searchAccount(page = 1, limit = 20, query) {
    const { skip, limit: paginatedLimit } = paginate({}, page, limit);

    const accounts = await this.accountRepository.dynamicSearch(
      skip,
      paginatedLimit,
      query
    );

    const total = await this.accountRepository.getTotalByDynamicQuery(query);

    return {
      accounts: await this.listAccounts(accounts),
      pagination: {
        page: parseInt(page),
        limit: paginatedLimit,
        total,
      },
    };
  }

  async listAccounts(accounts) {
    return accounts.map((account) => {
      const accountObject = account.toObject();
      delete accountObject._id;
      delete accountObject.hashedPassword;
      delete accountObject.accessToken;
      delete accountObject.__v;

      return {
        ...accountObject,
      };
    });
  }
}

module.exports = GetAccount;
