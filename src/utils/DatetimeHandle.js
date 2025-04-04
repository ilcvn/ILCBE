const AppError = require("./AppError");
const sendResponse = require("./Response");

class DateTimeHandle{
  // Timezone = 'VN'

  static getCurrentDate(){
    const today = new Date();
    today.setHours(today.getHours() + 7);

    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const day = today.getUTCDate();

    const date = new Date(Date.UTC(year, month, day));
    
    return new Date(date);
  }

  static getDateByOption(year, month, day){
    const date = new Date(year, month, day);
    date.setHours(date.getHours() + 7);
    return date;
  }
}

module.exports = DateTimeHandle;
