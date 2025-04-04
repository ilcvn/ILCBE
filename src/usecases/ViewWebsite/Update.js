const AppError = require("../../utils/AppError");
const DateTimeHandle = require("../../utils/DatetimeHandle");
class UpdateViewWebsite {
  constructor(viewWebsiteRepository) {
    this.viewWebsiteRepository = viewWebsiteRepository;
  }

  async executed() {
    const today = DateTimeHandle.getCurrentDate();
    const viewWebsite = await this.viewWebsiteRepository.getViewWebsiteInfoByDate(today);

    if(viewWebsite){
      const updatedViewWebsite = await this.viewWebsiteRepository.update(today);
      return updatedViewWebsite;
    }else{
      
      const viewWebsite = {
        view:1,
        createDate: today,
        updateDate: Date.now(),
      };
        const createdViewWebsite = await this.viewWebsiteRepository.create(viewWebsite);
        return createdViewWebsite;
    }
  }
}

module.exports = UpdateViewWebsite;
