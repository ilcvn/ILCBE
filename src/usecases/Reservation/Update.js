const AppError = require("../../utils/AppError");

class UpdateReservation {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async executed(id, updateData) {
    const existingReservation = await this.reservationRepository.findById(id);

    if (!existingReservation) {
      throw new AppError("Reservation does not exist", 404);
    }

    delete updateData.id;

    const updatedReservation = await this.reservationRepository.update(
      id,
      updateData
    );
    return updatedReservation;
  }
}

module.exports = UpdateReservation;
