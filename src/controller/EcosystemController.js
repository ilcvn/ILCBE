const {
  CreateEcosystemUsecase,
  UpdateEcosystemUsecase,
  DeleteEcosystemUsecase,
  GetEcosystemUsecase,
} = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class EcosystemController {
  constructor(ecosystemRepository) {
    this.createEcosystemUsecase = new CreateEcosystemUsecase(ecosystemRepository);
    this.updateEcosystemUsecase = new UpdateEcosystemUsecase(ecosystemRepository);
    this.deleteEcosystemUseCase = new DeleteEcosystemUsecase(ecosystemRepository);
    this.getEcosystemUseCase = new GetEcosystemUsecase(ecosystemRepository);
  }

  // create
  async createEcosystem(req, res) {
    try {
      const ecosystemData = req.body;

      if (!ecosystemData.fullName) {
        throw new AppError("All fields (name, role) are required.", 400);
      }

      await this.createEcosystemUsecase.executed(ecosystemData);

      sendResponse(res, 201, "create success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // update
  async updateEcosystem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      if (!updateData) {
        throw new AppError("Nothing to update", 400);
      }

      await this.updateEcosystemUsecase.executed(id, updateData);

      sendResponse(res, 200, "Update Ecosystem success", null);
    } catch (error) {
      console.log(error);
      sendError(res, error);
    }
  }

  // delete
  async deleteEcosystem(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      await this.deleteEcosystemUseCase.executed(id);
      sendResponse(res, 200, "Delete Ecosystem success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // search
  async dynamicSearch(req, res) {
    try {
      const { page = 1, limit = 20, ...query } = req.query;
      const ecosystems = await this.getEcosystemUseCase.searchEcosystem(
        page,
        limit,
        query
      );
      sendResponse(res, 200, "Find success", "success", ecosystems);
    } catch (error) {
      console.error("Fail", error);
      this.handleError(res, error);
    }
  }
}

module.exports = EcosystemController;
