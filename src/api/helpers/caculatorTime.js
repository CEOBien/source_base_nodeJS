const moment = require("moment");
const { Op } = require("sequelize");
const checkin_status = (logtime) => {
  if (!logtime) {
    return 0;
  }
  const start_time = moment(logtime, "YYYY-MM-DD HH:mm:ss");

  const hour = start_time.hour();

  const minute = start_time.minute();
  const isCheck = hour >= 7 && hour <= 8;

  // const isCheck2 = (hour === 16 && minute >= 0) || (hour === 16 && minute < 40)
  if (isCheck) {
    return 1;
  }
  return 5;
};

const checkout_status = (logtime) => {
  if (!logtime) {
    return 0;
  }
  const start_time = moment(logtime, "YYYY-MM-DD HH:mm:ss");
  const hour = start_time.hour();
  const minute = start_time.minute();
  const isCheck = hour >= 17 && minute >= 30 && hour <= 23 && minute <= 59;

  if (isCheck) {
    return 1;
  }
  return 6;
};

const logTime = (time) => {
  // Tính tổng giờ logtime bằng Sequelize
  if (time > 1) return "GREAT";
  if (time == 1) return "OK";
  return "NOT OK";
};


module.exports = {
  checkin_status,
  checkout_status,
  logTime,
};
