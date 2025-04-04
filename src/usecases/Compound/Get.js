const AppError = require("../../utils/AppError");
const { paginate } = require("../../utils/Pagination");
const DateTimeHandle = require("../../utils/DatetimeHandle");
const ReservationStatus = require("../../enums/ReservationEnum");

class GetSystem {
  constructor(reservationRepository, viewWebisteRepository) {
    this.reservationRepository = reservationRepository;
    this.viewWebisteRepository = viewWebisteRepository
  }

  async getAllDashboardStatisticToday() {

    const today = DateTimeHandle.getCurrentDate();
    const viewWebsites = await this.viewWebisteRepository.getAllViewWebsites(); 
    const reservations = await this.reservationRepository.getAllReservations()
    
    const viewToday = viewWebsites.filter(item => {return item.createDate >= today;}).reduce((sum, item) => sum + item.view, 0);

    const reservationfilteredTodayList = reservations.filter(item => {return item.createdDate >= today;}).length;

    const need2HandleConsultationList = reservations.filter(
      item => {return (item.status === ReservationStatus.PENDING && 
                      item.consultDate.getUTCFullYear() === today.getUTCFullYear() && 
                      item.consultDate.getUTCMonth() === today.getUTCMonth() && 
                      item.consultDate.getUTCDate() === today.getUTCDate());}).length;
                      
    const needForgotHandleConsultationList = reservations.filter(
      item => {
        return (item.status === ReservationStatus.PENDING && item.consultDate < today)}).length;
    return { viewToday: viewToday, contactTodayList: reservationfilteredTodayList, forgotHandleContactList : needForgotHandleConsultationList, need2HandleConsultationList: need2HandleConsultationList};
  }
}

module.exports = GetSystem;
