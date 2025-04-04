const { GetCompoundUsecase } = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class CompoundController {

  constructor(reservationRepository, viewWebisteRepository) {
    this.getCompoundUsecase =  new  GetCompoundUsecase(reservationRepository, viewWebisteRepository);
  }

  async getAllDashboardStatisticToday(req, res) {
    try {
      const statistic = await this.getCompoundUsecase.getAllDashboardStatisticToday();
      const responseData = statistic
      sendResponse(res, 200, "Get statistic for dashboard success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }


}

module.exports = CompoundController;
