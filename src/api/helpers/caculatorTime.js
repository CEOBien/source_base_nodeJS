const moment = require("moment");
const { Op } = require("sequelize");

const caculatorWorkingTime = ({checkin_time, checkout_time}) => {
  
  const formatCheckin = moment(checkin_time).format("HH:mm");
  const formatCheckout = moment(checkout_time).format("HH:mm");
  const checkoutTime = moment(formatCheckout, "HH:mm");
  const checkinTime = moment(formatCheckin, "HH:mm");
  
  const totalTimeWorkingMinutes = checkoutTime.diff(
    checkinTime,
    "minutes",
    true
  );

  const duration = moment.duration(totalTimeWorkingMinutes, "minutes");
  const hours = duration.hours();
  const minutes = duration.minutes();
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
};

module.exports = caculatorWorkingTime;
