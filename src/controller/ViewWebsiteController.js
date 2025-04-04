const { UpdateViewWebsiteUsecase, GetViewWebsiteUsecase } = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class ViewWebsiteController {
  constructor(viewWebsiteRepository) {
    this.updateViewWebsiteUsecase = new UpdateViewWebsiteUsecase(viewWebsiteRepository);
    this.getViewWebsiteUseCase = new GetViewWebsiteUsecase(viewWebsiteRepository);
  }

  async updateViewWebsite(req, res) {
    try {
      await this.updateViewWebsiteUsecase.executed();
      sendResponse(res, 200, "Update ViewWebsite success", null);
    } catch (error) {
      console.log(error);
      sendError(res, error);
    }
  }

  // get
  async getAllViewWebsiteStatisticByYear(req, res) {
    try {
      const {year} = req.params;
      const statistic = await this.getViewWebsiteUseCase.getAllViewWebsiteStatisticByYear(year);
      const responseData = statistic

      sendResponse(res, 200, "Get statistic success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = ViewWebsiteController;
