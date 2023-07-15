const moment = require("moment");
const { Op } = require("sequelize");

const getWorkingHour = (LIST_USER_ATTENDANCE) => {
  try {
    const resultObj = {};

    for (let i = 0; i < LIST_USER_ATTENDANCE.length; i++) {
      const attendance = LIST_USER_ATTENDANCE[i];
      const attendanceDate = attendance.ATTENDANCE_DATE;

      //save check_in_date_time into temp variable
      if (attendance.CHECK_IN_DATE_TIME) {
        temp = attendance;
      }

      if (attendance.CHECK_OUT_DATE_TIME && temp) {
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

        //thêm key
        resultObj[attendanceDate].userId = attendance.USER_ID;
        resultObj[attendanceDate].Name = "Trương Quốc Tuấn";
        resultObj[attendanceDate].date = attendanceDate;

        //Định dạng lại giờ
        resultObj[attendanceDate].totalWorkHour = `${newHours
          .toString()
          .padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
      }
    }

    return resultObj;
  } catch (error) {
    console.log(error);
  }
};

const formatDay = (day) => {
  try {
    const momentDate = moment(day);
    const startOfDay = momentDate.startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const endOfDay = momentDate.endOf("day").format("YYYY-MM-DD HH:mm:ss");
    return { startOfDay, endOfDay };
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getWorkingHour, formatDay };
