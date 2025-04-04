const AppError = require("../../utils/AppError");

class DeleteReservation {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async executed(id) {
    const existingReservation = await this.reservationRepository.findById(id);

    if (!existingReservation) {
      throw new AppError("Reservation does not exist", 404);
    }

    const result = await this.reservationRepository.delete(id);
    return result;
  }
}

module.exports = DeleteReservation;
