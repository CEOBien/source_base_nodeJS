const db = require("../models");
const { getWorkingHour } = require("../helpers/caculatorTime");
const moment = require("moment");
const createError = require("http-errors");
const { Op } = require("sequelize");
require("dotenv").config();

const checkRequireDataRequest = require("../helpers/checkRequireDataRequest");

const attendanceServices = {
  checkIn: async ({ USER_ID, LOCATION_ID, CHECKIN_TYPE_CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //trạng thái checkin checkout
        var CHECK_IN = await db.User_Attendance_Statuses.findOne({
          where: { CD: "IN" },
        });
        var CHECK_OUT = await db.User_Attendance_Statuses.findOne({
          where: { CD: "OUT" },
        });
        var idType = await db.User_CheckIn_Types.findOne({
          where: { CD: CHECKIN_TYPE_CD },
        });
        //lấy giờ hiện tại
        const currentTime = new Date();
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999));

        //kiểm tra user đã điểm danh hay chưa
        const isCheck = await db.User_Attendances.findAll({
          where: {
            USER_ID: USER_ID,
            CREATED_DATE: {
              [db.Sequelize.Op.between]: [startOfDay, endOfDay],
            },
          },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });
        //validate
        if (!Number.isInteger(LOCATION_ID)) {
          throw createError.NotFound("It must be number");
        }
        if (!CHECK_IN) throw createError.NotFound("Status CD `IN` not found ");
        if (!CHECK_OUT)
          throw createError.NotFound("Status CD `OUT` not found ");
        //check bảng ghi có tồn tại hay không
        if (isCheck[0] !== undefined) {
          //Kiểm tra đã checkin hay chưa
          if (isCheck[0].CHECKIN_STATUS_ID === CHECK_IN.id)
            throw createError.NotFound("You have checkin");
        }
        //Kiểm tra nếu rỗng hoặc đã check out thì cho tạo bảng ghi
        if (
          isCheck[0] === undefined ||
          isCheck[0].CHECKIN_STATUS_ID === CHECK_OUT.id
        ) {
          const toDay = moment();

          //tạo bảng
          const attendance = await db.User_Attendances.create({
            CHECK_IN_DATE_TIME: toDay,
            LOCATION_ID: LOCATION_ID,
            CHECKIN_STATUS_ID: CHECK_IN.id,
            USER_ID: USER_ID,
            CHECKIN_TYPE_ID: idType.id,
          });
          return resolve({
            err: attendance ? 0 : 1,
            mess: attendance ? "Checkin successfully" : "Error while checkin",
            attendance,
            links: {
              checkout: `${process.env.HYBER_LINK}/api/v1/attendance/checkOut`,
              getAll: `${process.env.HYBER_LINK}/api/attendance/getAll`,
            },
          });
        }
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  },
  checkOut: async ({ USER_ID, LOCATION_ID, CHECKOUT_TYPE_CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //status
        var CHECK_IN = await db.User_Attendance_Statuses.findOne({
          where: { CD: "IN" },
        });
        var CHECK_OUT = await db.User_Attendance_Statuses.findOne({
          where: { CD: "OUT" },
        });
        var idType = await db.User_CheckIn_Types.findOne({
          where: { CD: CHECKOUT_TYPE_CD },
        });
        //lấy giờ
        var currentTime = new Date();
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999));

        //check xem bảng ghi có tồn tại hay không
        const isCheck = await db.User_Attendances.findAll({
          where: {
            USER_ID: USER_ID,
            CREATED_DATE: {
              [db.Sequelize.Op.between]: [startOfDay, endOfDay],
            },
          },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });

        if (!Number.isInteger(LOCATION_ID)) {
          throw createError.NotFound("It must be number");
        }
        if (!CHECK_IN) throw createError.NotFound("Status CD `IN` not found ");
        if (!CHECK_OUT)
          throw createError.NotFound("Status CD `OUT` not found ");
        if (isCheck[0] === undefined)
          throw createError.NotFound("You must checkin before checkout");

        if (isCheck[0].CHECKIN_STATUS_ID === CHECK_OUT.id)
          throw createError.NotFound("You have checkout");

        if (isCheck[0].CHECKIN_STATUS_ID === CHECK_IN.id) {
          const toDay = moment();
          const attendance = await db.User_Attendances.create({
            CHECK_OUT_DATE_TIME: toDay,
            LOCATION_ID: LOCATION_ID,
            CHECKIN_STATUS_ID: CHECK_OUT.id,
            USER_ID: USER_ID,
            CHECKIN_TYPE_ID: idType.id,
          });

          return resolve({
            err: attendance ? 0 : 1,
            mess: attendance ? "Checkout successfully" : "Error while checkout",
            attendance,
            links: {
              checkIn: `${process.env.HYBER_LINK}/api/v1/attendance/checkIn`,
              getAll: `${process.env.HYBER_LINK}/api/attendance/getAll`,
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
            model: db.User_Attendance_Statuses,
            attributes: ["name"],
          },
          {
            model: db.User_CheckIn_Types,
            attributes: ["name"],
          },
        ];

        const where = {};

        for (const key in object) {
          if (object.hasOwnProperty(key) && object[key]) {
            where[key] = object[key];
          }
        }

        const getAll = await db.User_Attendances.findAndCountAll({
          include,
          where,
          attributes: [
            "USER_ID",
            "CHECK_IN_DATE_TIME",
            "CHECK_OUT_DATE_TIME",
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
          ],
          order: [["USER_ID", "ASC"]],
        });
        console.log(checkRequireDataRequest(getAll));
        if (!checkRequireDataRequest(getAll))
          throw createError.NotFound("Not found data");
        resolve({
          err: 0,
          mess: "Get list successfully",
          getAll,
          links: {
            checkIn: `${process.env.HYBER_LINK}/api/v1/attendance/checkIn`,
            checkOut: `${process.env.HYBER_LINK}/api/v1/attendance/checkOut`,
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
        const getUserId = await db.User_Attendances.findOne({
          where: { USER_ID: id },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });
        if (!getUserId) {
          throw createError.NotFound("Checkin not data");
        }
        resolve({
          err: getUserId ? 0 : 1,
          mess: "Get userID successfully",
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
        const deleteAttendance = await db.User_Attendances.destroy({
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

  getWorkingHours: async ({ USER_ID, FROM_DATE, TO_DATE }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const moment = require("moment");

        // Tạo đối tượng Moment cho ngày bắt đầu và kết thúc
        const fromDate = moment(FROM_DATE);
        const toDate = moment(TO_DATE);
        const fromDateStr = moment(fromDate).format("YYYY-MM-DD HH:mm:ss");
        const toDateStr = moment(toDate)
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const list_user_attendace = await db.User_Attendances.findAll({
          attributes: [
            "USER_ID",
            [db.Sequelize.literal("DATE(CREATED_DATE)"), "ATTENDANCE_DATE"],
            "CHECK_IN_DATE_TIME",
            "CHECK_OUT_DATE_TIME",
          ],
          where: {
            USER_ID: USER_ID,
            CREATED_DATE: {
              [Op.between]: [
                db.Sequelize.literal("'" + fromDateStr + "'"),
                db.Sequelize.literal("'" + toDateStr + "'"),
              ],
            },
          },
          raw: true,
        });
        const result = getWorkingHour(list_user_attendace);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  countUserCheckedInByDate: async ({ DATE }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const momentDate = moment(DATE).startOf("day");
        const startOfDay = momentDate
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const endOfDay = momentDate.endOf("day").format("YYYY-MM-DD HH:mm:ss");
        const countUserCheckin = await db.User_Attendances.count({
          where: {
            CREATED_DATE: { [Op.between]: [startOfDay, endOfDay] },
            CHECK_IN_DATE_TIME: { [Op.not]: null },
          },
        });
        resolve({
          err: countUserCheckin ? 0 : 1,
          mess: countUserCheckin
            ? "List of users who have checked in"
            : "get user checked in not found",
          countUserCheckedIn: countUserCheckin,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  countUserCheckedOutByDate: async ({ DATE }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const momentDate = moment(DATE).startOf("day");
        const startOfDay = momentDate
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss");
        const endOfDay = momentDate.endOf("day").format("YYYY-MM-DD HH:mm:ss");
        const countUserCheckOut = await db.User_Attendances.count({
          where: {
            CREATED_DATE: { [Op.between]: [startOfDay, endOfDay] },
            CHECK_OUT_DATE_TIME: { [Op.not]: null },
          },
        });
        resolve({
          err: countUserCheckOut ? 0 : 1,
          mess: countUserCheckOut
            ? "List of users who have checked out"
            : "get user checked out not found",
          countUserCheckedOut: countUserCheckOut,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};
module.exports = attendanceServices;
