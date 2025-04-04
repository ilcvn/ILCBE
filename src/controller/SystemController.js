const { UpdateSystemUsecase, GetSystemUsecase } = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class SystemController {
  constructor(systemRepository) {
    this.updateSystemUsecase = new UpdateSystemUsecase(systemRepository);
    this.getSystemUseCase = new GetSystemUsecase(systemRepository);
  }

  // update
  async updateSystem(req, res) {
    try {
      const updateData = req.body;
      if (!updateData) {
        throw new AppError("Nothing to update", 400);
      }

      await this.updateSystemUsecase.executed(updateData);

      sendResponse(res, 200, "Update system success", null);
    } catch (error) {
      console.log(error);
      sendError(res, error);
    }
  }

  // get
  async getSystemDetail(req, res) {
    try {
      const system = await this.getSystemUseCase.getSystem();

      const responseData = {
        id: system.id,
        name: system.name,
        address: system.address,
        phone: system.phone,
        gmail: system.gmail,
        logo_url: system.logo_url,
        createDate: system.createDate,
      };

      sendResponse(res, 200, "Get detail success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = SystemController;
