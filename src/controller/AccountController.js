const {
  CreateAccountUsecase,
  LoginUseCase,
  DeleteAccountUseCase,
  UpdateAccountUseCase,
  GetAccountUseCase,
} = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class AccountController {
  constructor(accountRepository) {
    this.createAccountUsecase = new CreateAccountUsecase(accountRepository);
    this.loginUseCase = new LoginUseCase(accountRepository);
    this.deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);
    this.updateAccountUseCase = new UpdateAccountUseCase(accountRepository);
    this.getAccountUseCase = new GetAccountUseCase(accountRepository);
  }

  // create
  async createAccount(req, res) {
    try {
      const accountData = req.body;

      if (
        !accountData.name ||
        !accountData.userName ||
        !accountData.password ||
        !accountData.role
      ) {
        throw new AppError(
          "All fields (name, username, password) are required.",
          400
        );
      }

      const account = await this.createAccountUsecase.executed(accountData);

      const responseData = {
        id: account.id,
        name: account.name,
        userName: account.userName,
        role: account.role,
        createDate: account.createDate,
      };

      sendResponse(res, 201, "", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }

  // login
  async login(req, res) {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        throw new AppError(
          "All fields (username, password) are required.",
          400
        );
      }
      const accessToken = await this.loginUseCase.login(userName, password);
      sendResponse(res, 200, "Login success", "success", { accessToken });
    } catch (error) {
      sendError(res, error);
    }
  }

  // delete
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id are required.", 400);
      }
      await this.deleteAccountUseCase.executed(id);
      sendResponse(res, 200, "Delete account success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // update
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        throw new AppError("Id are required.", 400);
      }
      if (!updateData) {
        throw new AppError("Notthing to update", 400);
      }
      await this.updateAccountUseCase.executed(id, updateData);

      sendResponse(res, 200, "Update account success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // get
  async getSelfInfo(req, res) {
    try {
      const btoken = req.headers.authorization;
      const token = btoken.split(" ")[1];
      const account = await this.getAccountUseCase.getAccountByToken(token);

      const responseData = {
        id: account.id,
        name: account.name,
        userName: account.userName,
        role: account.role,
        createDate: account.createDate,
      };

      sendResponse(res, 200, "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }

  // seach
  async dynamicSearch(req, res) {
    try {
      const { page = 1, limit = 20, ...query } = req.query;
      const accounts = await this.getAccountUseCase.searchAccount(
        page,
        limit,
        query
      );
      sendResponse(res, 200, "find success", "success", accounts);
    } catch (error) {
      console.error("fail", error);
      this.handleError(res, error);
    }
  }
}

module.exports = AccountController;
