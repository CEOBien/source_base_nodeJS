const moment = require("moment");
const { Op } = require("sequelize");
const { dataGetAllUser } = require("./api");

const calculateStatus = (newMinutes) => {
  return newMinutes > 480
    ? "GREAT"
    : newMinutes === 480
    ? "OK"
    : "Not enough 8 hours";
};

const getWorkingHour = (LIST_USER_ATTENDANCE, data) => {
  try {
    const resultObj = {};
    let user_name = data.elements.find(
      (element) => element.id == LIST_USER_ATTENDANCE[1].USER_ID
    );
    for (let i = 0; i < LIST_USER_ATTENDANCE.length; i++) {
      const attendance = LIST_USER_ATTENDANCE[i];
      const attendanceDate = attendance.ATTENDANCE_DATE;
      

      //save check_in_date_time into temp variable
      if (attendance.CHECK_IN_DATE_TIME !== null) {
        temp = attendance;
      }

      if (attendance.CHECK_OUT_DATE_TIME !== null && temp) {
        const check_out_time = new Date(attendance.CHECK_OUT_DATE_TIME);

        const check_in_time = new Date(temp.CHECK_IN_DATE_TIME);

        const totalWorks = Math.floor(
          (check_out_time - check_in_time) / 1000 / 60
        );
        // Định dạng giờ:phút
        const hours = Math.floor(totalWorks / 60);
        const minutes = totalWorks % 60;

        // Cập nhật đối tượng kết quả
        if (!resultObj[attendanceDate]) {
          resultObj[attendanceDate] = { totalWorkHour: "00:00" };
        }

        //tách giờ và phút
        const totalWorkHour = resultObj[attendanceDate].totalWorkHour;
        const [prevHours, prevMinutes] = totalWorkHour.split(":").map(Number);

        // Tính lại giờ mới
        const newHours =
          prevHours + hours + Math.floor((prevMinutes + minutes) / 60);
        const newMinutes = (prevMinutes + minutes) % 60;
        const caculatorStatusFollowMinutes = newHours * 60 + newMinutes;

        //thêm key

        resultObj[attendanceDate].status = calculateStatus(
          caculatorStatusFollowMinutes
        );
        resultObj[attendanceDate].userId = attendance.USER_ID;
        resultObj[attendanceDate].fullName = user_name
          ? user_name.FULL_NAME
          : "";
        resultObj[attendanceDate].workingDate = attendance.CHECK_OUT_DATE_TIME;

        //Định dạng lại giờ
        resultObj[attendanceDate].totalWorkHour = `${newHours
          .toString()
          .padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
      }
    }

    const sortedDates = Object.entries(resultObj).sort(function (a, b) {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    const sortedObject = Object.fromEntries(sortedDates);

    return sortedObject;
  } catch (error) {
    console.log(error);
  }
};

const formatDay = (DATE) => {
  try {
    const splitDay = DATE.split("T")[0];

    const startOfDay = new Date(`${splitDay}T17:00:00.110Z`);
    startOfDay.setDate(startOfDay.getDate() - 1);
    const endOfDay = `${splitDay}T16:59:59.308Z`;
    return { startOfDay, endOfDay };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getWorkingHour, formatDay };
