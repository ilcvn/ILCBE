class CreateReservation {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async executed(data) {
    const lastID = await this.reservationRepository.getLastId();
    const newId = lastID + 1;

    const reservation = {
      ...data,
      id: newId,
    };

    const createdReservation = await this.reservationRepository.create(
      reservation
    );
    return createdReservation;
  }
}

module.exports = CreateReservation;
