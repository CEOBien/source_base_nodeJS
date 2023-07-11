const db = require("../models");
const {
  checkin_status,
  checkout_status,
  logTime,
} = require("../helpers/caculatorTime");
const moment = require("moment");
const { Op } = require("sequelize");

const attendanceServices = {
  checkIn: async ({ USER_ID, LOCATION_ID, CHECKIN_TYPE_ID }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //trạng thái checkin checkout
        var CHECK_IN = 2;
        var CHECK_OUT = 1;
        //lấy giờ hiện tại
        const currentTime = new Date();
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999));

        //kiểm tra user đã điểm danh hay chưa
        const isCheck = await db.Attendance.findAll({
          where: {
            user_id: USER_ID,
            CREATED_DATE: {
              [db.Sequelize.Op.between]: [startOfDay, endOfDay],
            },
          },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });
        //validate
        if (!Number.isInteger(LOCATION_ID)) {
          return resolve({
            err: 1,
            mess: "Invalid location_id value, it must be a number",
          });
        }
        if (!Number.isInteger(CHECKIN_TYPE_ID)) {
          return resolve({
            err: 1,
            mess: "Invalid checkin_type_id value, it must be a number",
          });
        }
        //check bảng ghi có tồn tại hay không
        if (isCheck[0] !== undefined) {
          //Kiểm tra đã checkin hay chưa
          if (isCheck[0].CHECKIN_STATUS_ID === CHECK_IN)
            return resolve({ err: 1, mess: "You have checkin" });
        }
        //Kiểm tra nếu rỗng hoặc đã check out thì cho tạo bảng ghi
        if (
          isCheck[0] === undefined ||
          isCheck[0].CHECKIN_STATUS_ID === CHECK_OUT
        ) {
          const toDay = moment();

          //tạo bảng
          const attendance = await db.Attendance.create({
            CHECK_IN_TIME: toDay,
            LOCATION_ID: LOCATION_ID,
            CHECKIN_STATUS_ID: CHECK_IN,
            USER_ID: USER_ID,
            CHECKIN_TYPE_ID: CHECKIN_TYPE_ID,
          });
          return resolve({
            err: attendance ? 0 : 1,
            mess: attendance ? "Checkin successfully" : "Error while checkin",
            attendance,
            links: {
              checkout: "http://localhost:9999/api/v1/attendance/checkout",
              getAll: "http://localhost:10101/api/attendance/getall",
            },
          });
        }
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  },
  checkOut: async ({ USER_ID, LOCATION_ID, CHECKIN_TYPE_ID }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //status
        var CHECK_IN = 2;
        var CHECK_OUT = 1;
        //lấy giờ
        var currentTime = new Date();
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999));

        //check xem bảng ghi có tồn tại hay không
        const isCheck = await db.Attendance.findAll({
          where: {
            USER_ID: USER_ID,
            CREATED_DATE: {
              [db.Sequelize.Op.between]: [startOfDay, endOfDay],
            },
          },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });
        console.log(isCheck);
        if (!Number.isInteger(LOCATION_ID)) {
          return resolve({
            err: 1,
            mess: "Invalid location_id value, it must be a number",
          });
        }
        if (!Number.isInteger(CHECKIN_TYPE_ID)) {
          return resolve({
            err: 1,
            mess: "Invalid checkin_type_id value, it must be a number",
          });
        }

        if (isCheck[0] === undefined)
          return resolve({
            err: 1,
            mess: "Please check in before checking out",
          });

        if (isCheck[0].CHECKIN_STATUS_ID === CHECK_OUT)
          return resolve({ err: 1, mess: "You have checked out" });

        if (isCheck[0].CHECKIN_STATUS_ID === CHECK_IN) {
          const toDay = moment();
          const attendance = await db.Attendance.create({
            CHECK_OUT_TIME: toDay,
            LOCATION_ID: LOCATION_ID,
            CHECKIN_STATUS_ID: CHECK_OUT,
            USER_ID: USER_ID,
            CHECKIN_TYPE_ID: CHECKIN_TYPE_ID,
          });

          return resolve({
            err: attendance ? 0 : 1,
            mess: attendance ? "Checkout successfully" : "Error while checkout",
            attendance,
            links: {
              checkin: "http://localhost:9999/api/v1/attendance/checkin",
              getAll: "http://localhost:9999/api/attendance/getall",
            },
          });
        }
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  },

  getAllByQuery: async ({ ...object }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const include = [
          {
            model: db.CheckInStatus,
            attributes: ["name"],
          },
          {
            model: db.CheckInType,
            attributes: ["name"],
          },
        ];

        const where = {};

        for (const key in object) {
          if (object.hasOwnProperty(key) && object[key]) {
            where[key] = object[key];
          }
        }

        const getAll = await db.Attendance.findAndCountAll({
          include,
          where,
          limit: 10,
          attributes: [
            "USER_ID",
            "CHECK_IN_TIME",
            "CHECK_OUT_TIME",
            [
              db.sequelize.literal(
                `CASE 
                   WHEN COALESCE( CHECK_IN_TIME) IS NULL THEN 'NULL'
                   WHEN HOUR(CHECK_IN_TIME) BETWEEN 7 AND 8 THEN 'ONTIME' 
                   ELSE 'DELAYED' 
                 END`
              ),
              "CHECK_IN_STATUS",
            ],
            [
              db.sequelize.literal(
                `CASE
                 WHEN COALESCE( CHECK_OUT_TIME) IS NULL THEN 'WORKING' 
                 WHEN HOUR(CHECK_OUT_TIME) BETWEEN 17 AND 23 AND MINUTE(CHECK_OUT_TIME) BETWEEN 30 AND 59 THEN 'ONTIME' ELSE 'SOON' END`
              ),
              "CHECK_OUT_STATUS",
            ],
            [
              db.sequelize.literal(
                `CASE
                 WHEN TIMESTAMPDIFF(HOUR, CHECK_IN_TIME, CHECK_OUT_TIME) = 8 THEN 'OK'
                 WHEN TIMESTAMPDIFF(HOUR, CHECK_IN_TIME, CHECK_OUT_TIME) < 8 THEN 'NOT OK'
                 WHEN TIMESTAMPDIFF(HOUR, CHECK_IN_TIME, CHECK_OUT_TIME) > 8 THEN 'GREAT'
                 END`
              ),
              "TOTAL_LOGTIME",
            ],
          ],
          order: [["USER_ID", "ASC"]],
        });

        resolve({
          err: 0,
          mess: "Get list successfully",
          getAll,
          links: {
            checkin: "http://localhost:9999/api/v1/attendance/checkin",
            checkout: "http://localhost:9999/api/v1/attendance/checkout",
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getUserId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const getUserId = await db.Attendance.findOne({
          where: { USER_ID: id },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });
        console.log(getUserId);
        resolve({
          err: getUserId ? 0 : 1,
          mess: getUserId ? "Get userID successfully" : "Id not exited",
          getUserId,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  deleteAttendance: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteAttendance = await db.Attendance.destroy({
          where: { id: id },
        });
        resolve({
          err: deleteAttendance ? 0 : 1,
          mess: deleteAttendance
            ? "delete record successfully"
            : "Error while delete",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};
module.exports = attendanceServices;
