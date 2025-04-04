const AppError = require("../../utils/AppError");
const DateTimeHandle = require("../../utils/DatetimeHandle");

class GetViewWebsite {
  constructor(viewWebisteRepository) {
    this.viewWebisteRepository = viewWebisteRepository;
  }

  async getAllViewWebsiteStatisticByYear(year) {
    const allMonths = [];
    const viewWebsite = await this.viewWebisteRepository.getAllViewWebsites(); 
    
    for(let month = 0; month<12; month++){
      const firstDateOfMonth = DateTimeHandle.getDateByOption(year, month, 1);
      const firstDateOfNextMonth = DateTimeHandle.getDateByOption(year, month+1, 1);
      
      const filteredList = viewWebsite.filter(item => {
        const itemDate = item.createDate;
        return itemDate >= firstDateOfMonth && itemDate < firstDateOfNextMonth;
      });
      const views = filteredList.reduce((sum, item) => sum + item.view, 0);
      allMonths.push({ dateName: 'T' + (month + 1), view: views});
    }
    return allMonths;
  }
}

module.exports = GetViewWebsite;
