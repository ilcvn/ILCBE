const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");
const ReservationType = require("../../enums/ReservationEnum");
const DateTimeHandle = require("../../utils/DatetimeHandle");

class GetReservation {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  async getReservationById(id) {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new AppError("Reservation does not exist", 404);
    }
    return reservation;
  }

  async searchReservation(page = 1, limit = 20, query) {
    const { skip, limit: paginatedLimit } = paginate({}, page, limit);

    const reservations = await this.reservationRepository.dynamicSearch(
      skip,
      paginatedLimit,
      query
    );

    const total = await this.reservationRepository.getTotalByDynamicQuery(
      query
    );

    return {
      reservations: await this.listReservations(reservations),
      pagination: {
        page: parseInt(page),
        limit: paginatedLimit,
        total,
      },
    };
  }

  async listReservations(reservations) {
    return reservations.map((reservation) => {
      const reservationObject = reservation.toObject();
      delete reservationObject._id;
      delete reservationObject.__v;
      return {
        ...reservationObject,
      };
    });
  }

  async get5NewestReservation() {
    const reservations = await this.reservationRepository.findAllPending();
    console.log(reservations.length);
    if (!reservations) {
      throw new AppError("reservations does not existt", 404);
    }
    const sortedReservations = reservations.sort(
      (a, b) => new Date(b.createDate) - new Date(a.createDate)
    );
    const top5Reservations = sortedReservations.slice(0, 5);
    return top5Reservations;
  }

  async getAllReservationStatisticByYear(year) {
    const allMonths = [];
    const reservations = await this.reservationRepository.getAllReservations();

    for (let month = 0; month < 12; month++) {
      const firstDateOfMonth = DateTimeHandle.getDateByOption(year, month, 1);
      const firstDateOfNextMonth = DateTimeHandle.getDateByOption(
        year,
        month + 1,
        1
      );

      const consultList = reservations.filter((item) => {
        const itemDate = item.createdDate;
        return (
          itemDate >= firstDateOfMonth &&
          itemDate < firstDateOfNextMonth
        );
      });

      allMonths.push({
        dateName: "T" + (month + 1),
        quantityConsult: consultList.length,
      });
    }
    return allMonths;
  }
}

module.exports = GetReservation;
