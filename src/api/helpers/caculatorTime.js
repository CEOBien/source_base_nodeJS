const moment = require("moment");
const { Op } = require("sequelize");

const caculatorWorkingTime = ({ checkin_time, checkout_time }) => {
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
const formatTime = (hours) => {
  const roundedHours = Math.floor(hours);
  const minutes = Math.round((hours - roundedHours) * 60);
  return `${roundedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
const getWorkingHour = (LIST_USER_ATTENDANCE) => {
  try {
    const resultObj = {};

    for (let i = 0; i < LIST_USER_ATTENDANCE.length; i++) {
      const attendance = LIST_USER_ATTENDANCE[i];
      const attendanceDate = attendance.ATTENDANCE_DATE;
      if (attendance.CHECK_IN_TIME) {
        temp = attendance;
      }
      if (attendance.CHECK_OUT_TIME && temp) {
        const check_out_time = new Date(attendance.CHECK_OUT_TIME);
        const check_in_time = new Date(temp.CHECK_IN_TIME);
        const totalWorks = Math.floor(
          (check_out_time - check_in_time) / 1000 / 60
        );
        if (!resultObj[attendanceDate]) {
          resultObj[attendanceDate] = { totalWorkHour: 0 };
        }

        resultObj[attendanceDate].totalWorkHour += totalWorks;
      }
    }

    return Object.values(resultObj);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { caculatorWorkingTime, getWorkingHour };
