const {
  CreateReservationUsecase,
  UpdateReservationUsecase,
  DeleteReservationUsecase,
  GetReservationUsecase,
} = require("../usecases");

const sendResponse = require("../utils/Response");
const sendError = require("../utils/HandleError");
const AppError = require("../utils/AppError");

class ReservationController {
  constructor(reservationRepository) {
    this.createReservationUsecase = new CreateReservationUsecase(
      reservationRepository
    );
    this.updateReservationUsecase = new UpdateReservationUsecase(
      reservationRepository
    );
    this.deleteReservationUseCase = new DeleteReservationUsecase(
      reservationRepository
    );
    this.getReservationUseCase = new GetReservationUsecase(
      reservationRepository
    );
  }

  // create
  async createReservation(req, res) {
    try {
      const reservationData = req.body;
      if (!reservationData.fullName || !reservationData.status) {
        throw new AppError(
          "All fields (fullName, type, status) are required.",
          400
        );
      }

      await this.createReservationUsecase.executed(reservationData);

      sendResponse(res, 201, "create success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // update
  async updateReservation(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      if (!updateData) {
        throw new AppError("Nothing to update", 400);
      }

      await this.updateReservationUsecase.executed(id, updateData);

      sendResponse(res, 200, "Update reservation success", null);
    } catch (error) {
      console.log(error);
      sendError(res, error);
    }
  }

  // delete
  async deleteReservation(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      await this.deleteReservationUseCase.executed(id);
      sendResponse(res, 200, "Delete reservation success", "success", null);
    } catch (error) {
      sendError(res, error);
    }
  }

  // get
  async getReservationDetail(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new AppError("Id is required.", 400);
      }
      const reservation = await this.getReservationUseCase.getReservationById(
        id
      );

      const responseData = {
        id: reservation.id,
        fullName: reservation.fullName,
        content: reservation.content,
        status: reservation.status,
        phone: reservation.phone,
        gmail: reservation.gmail,
        address: reservation.address,
        subject: reservation.subject,
        file: reservation.file,
        consultDate: reservation.consultDate,
        createdDate: reservation.createdDate,
      };

      sendResponse(res, 200, "Get detail success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }

  // search
  async dynamicSearch(req, res) {
    try {
      const { page = 1, limit = 20, ...query } = req.query;
      const reservations = await this.getReservationUseCase.searchReservation(
        page,
        limit,
        query
      );
      sendResponse(res, 200, "Find success", "success", reservations);
    } catch (error) {
      console.error("Fail", error);
      this.handleError(res, error);
    }
  }

  async get5NewestPendingReservation(req, res) {
    try {
      const twoDaysBefore = new Date();
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);

      const query = { status: "PENDING", createdDate: { $gt: twoDaysBefore } };
      const fiveNewestReservation =
        await this.getReservationUseCase.searchReservation(1, 5, query);

      if (!fiveNewestReservation) {
        throw new AppError("Reservations does not exist", 404);
      }
      sendResponse(res, 200, "find success", "success", fiveNewestReservation);
    } catch (error) {
      console.error("fail", error);
      this.handleError(res, error);
    }
  }

  // get
  async getAllReservationStatisticByYear(req, res) {
    try {
      const { year } = req.params;
      const statistic =
        await this.getReservationUseCase.getAllReservationStatisticByYear(year);
      const responseData = statistic;

      sendResponse(res, 200, "Get statistic success", "success", responseData);
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = ReservationController;
