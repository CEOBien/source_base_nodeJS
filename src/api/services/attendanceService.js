const db = require("../models");
const { getWorkingHour, formatDay } = require("../helpers/caculatorTime");
const moment = require("moment");
const createError = require("http-errors");
const { Op } = require("sequelize");
const { dataGetAllUser } = require("../helpers/api");
require("dotenv").config();

const checkRequireDataRequest = require("../helpers/checkRequireDataRequest");
const { checkinResult } = require("../helpers/checkin");
const reportCheckin = require("../helpers/reportCheckin");

const attendanceServices = {
  checkIn: async ({ USER_ID, LOCATION_ID, CHECKIN_TYPE_CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const resultUser = await dataGetAllUser();
        const data = resultUser.data;
        const isUser = data.elements.find((element) => element.id == USER_ID);
        if (!isUser) resolve({ status: 400, mess: "User_id not found" });
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
          const attendanceResult = checkinResult(attendance, data);
          return resolve({
            status: attendanceResult ? 200 : 400,
            mess: attendanceResult
              ? "Checkin successfully"
              : "Error while checkin",
            attendanceResult,
            links: {
              checkout: `${process.env.USER_DATA_BASE_URL}/api/v1/attendance/checkOut`,
              getAll: `${process.env.USER_DATA_BASE_URL}/api/attendance/getAll`,
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
        const resultUser = await dataGetAllUser();
        const data = resultUser.data;
        const isUser = data.elements.find((element) => element.id == USER_ID);
        if (!isUser) resolve({ status: 400, mess: "User_id not found" });
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
          const attendanceResult = checkinResult(attendance, data);
          return resolve({
            status: attendanceResult ? 200 : 400,
            mess: attendanceResult
              ? "Checkout successfully"
              : "Error while checkout",
            attendanceResult,
            links: {
              checkIn: `${process.env.USER_DATA_BASE_URL}/api/v1/attendance/checkIn`,
              getAll: `${process.env.USER_DATA_BASE_URL}/api/attendance/getAll`,
            },
          });
        }
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  },

  getAllByQuery: async (object) => {
    return new Promise(async (resolve, reject) => {
      try {
        const include = [
          {
            model: db.User_Attendance_Statuses,
            attributes: ["NAME"],
          },
          {
            model: db.User_CheckIn_Types,
            attributes: ["NAME"],
          },
        ];

        const where = {};

        for (const key in object) {
          if (object.hasOwnProperty(key) && object[key]) {
            if (key === "CHECK_IN_DATE_TIME" || key === "CHECK_OUT_DATE_TIME"|| key === "CREATED_DATE") {
              const splitDay = object[key].split("T")[0];

              const dayStart = new Date(`${splitDay}T17:00:00.110Z`);
              const endDay = `${splitDay}T16:59:59.308Z`;
              endDay.setDate(endDay.getDate() + 1);
              console.log("dayStart", dayStart);
              console.log("endDay", endDay);
              where[key] = {
                [Op.between]: [dayStart, endDay],
              };
            } else {
              where[key] = object[key];
            }
          }
        }

        const getAll = await db.User_Attendances.findAndCountAll({
          include,
          where,
          attributes: [
            "USER_ID",
            "CHECK_IN_DATE_TIME",
            "CHECK_OUT_DATE_TIME",
            "LOCATION_ID",
            [
              db.sequelize.literal(
                `CASE
                   WHEN COALESCE( CHECK_IN_DATE_TIME) IS NULL THEN 'NULL'
                   WHEN HOUR(CHECK_IN_DATE_TIME) BETWEEN 7 AND 8 THEN 'ONTIME'
                   ELSE 'DELAYED'
                 END`
              ),
              "CHECK_IN_STATUS",
            ],
            [
              db.sequelize.literal(
                `CASE
                 WHEN COALESCE( CHECK_OUT_DATE_TIME) IS NULL THEN 'WORKING'
                 WHEN HOUR(CHECK_OUT_DATE_TIME) BETWEEN 17 AND 23 AND MINUTE(CHECK_OUT_DATE_TIME) BETWEEN 30 AND 59 THEN 'ONTIME' ELSE 'SOON' END`
              ),
              "CHECK_OUT_STATUS",
            ],
          ],
        });
        if (!checkRequireDataRequest(getAll))
          resolve({ status: 200, mess: "Data not found" });
        resolve({
          status: 200,
          mess: "Get list successfully",
          getAll,
          links: {
            checkIn: `${process.env.USER_DATA_BASE_URL}/api/v1/attendance/checkIn`,
            checkOut: `${process.env.USER_DATA_BASE_URL}/api/v1/attendance/checkOut`,
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
        const currentTime = new Date();
        const startOfDay = new Date(currentTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentTime.setHours(23, 59, 59, 999));
        const getUserId = await db.User_Attendances.findOne({
          where: {
            USER_ID: id,
            CREATED_DATE: {
              [db.Sequelize.Op.between]: [startOfDay, endOfDay],
            },
          },
          order: [["CREATED_DATE", "DESC"]],
          raw: true,
        });
        if (!getUserId) {
          resolve({ status: 200, mess: "Checkin not data" });
        }
        resolve({
          status: getUserId ? 200 : 400,
          mess: getUserId ? "Get userID successfully" : "Not found",
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
          status: deleteAttendance ? 200 : 400,
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
        const result1 = await dataGetAllUser();
        const data = result1.data;
        const isCheck = data.elements.find((element) => element.id == USER_ID);
        if (!isCheck) resolve({ status: 400, mess: "User_id not found" });

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
                db.Sequelize.literal("'" + FROM_DATE + "'"),
                db.Sequelize.literal("'" + TO_DATE + "'"),
              ],
            },
          },
          raw: true,
        });

        if (list_user_attendace.length === 0)
          resolve({ status: 200, mess: "Data not found" });

        const result = getWorkingHour(list_user_attendace, data);
        resolve({
          status: 200,
          message: "Get list user work hour successfully",
          result,
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getCheckInStatus: async ({ TYPE, FROM_DATE, TO_DATE }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const include = [
          {
            model: db.User_Attendance_Statuses,
            attributes: ["NAME"],
          },
          {
            model: db.User_CheckIn_Types,
            attributes: ["NAME"],
          },
        ];
        const resultUser = await dataGetAllUser();
        const data = resultUser.data?.elements;
        const getAll = await db.User_Attendances.findAndCountAll({
          include,
          where: {
            CREATED_DATE: {
              [Op.between]: [
                db.Sequelize.literal("'" + FROM_DATE + "'"),
                db.Sequelize.literal("'" + TO_DATE + "'"),
              ],
            },
          },
          attributes: [
            "USER_ID",
            "CHECK_IN_DATE_TIME",
            "CHECK_OUT_DATE_TIME",
            [
              db.sequelize.literal(
                `CASE
                   WHEN COALESCE( CHECK_IN_DATE_TIME) IS NULL THEN 'NULL'
                   WHEN HOUR(CHECK_IN_DATE_TIME) BETWEEN 7 AND 8 THEN 'ONTIME'
                   ELSE 'DELAYED'
                 END`
              ),
              "CHECK_IN_STATUS",
            ],
            [
              db.sequelize.literal(
                `CASE
                 WHEN COALESCE( CHECK_OUT_DATE_TIME) IS NULL THEN 'WORKING'
                 WHEN HOUR(CHECK_OUT_DATE_TIME) BETWEEN 17 AND 23 AND MINUTE(CHECK_OUT_DATE_TIME) BETWEEN 30 AND 59 THEN 'ONTIME' ELSE 'SOON' END`
              ),
              "CHECK_OUT_STATUS",
            ],
          ],
          raw: true,
        });
        let result = reportCheckin(getAll, data);
        if (getAll.length === 0)
          resolve({ status: 200, mess: "Data not found" });
        resolve({
          status: 200,
          message: "Get list user work hour successfully",
          result,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  countUserCheckedInByDate: async ({ DATE }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const objectDay = formatDay(DATE);
        const countUserCheckin = await db.User_Attendances.count({
          where: {
            CREATED_DATE: {
              [Op.between]: [objectDay.startOfDay, objectDay.endOfDay],
            },
            CHECK_IN_DATE_TIME: { [Op.not]: null },
          },
        });
        resolve({
          status: countUserCheckin ? 200 : 400,
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
        const objectDay = formatDay(DATE);
        const countUserCheckOut = await db.User_Attendances.count({
          where: {
            CREATED_DATE: {
              [Op.between]: [objectDay.startOfDay, objectDay.endOfDay],
            },
            CHECK_OUT_DATE_TIME: { [Op.not]: null },
          },
        });
        resolve({
          status: countUserCheckOut ? 200 : 400,
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
