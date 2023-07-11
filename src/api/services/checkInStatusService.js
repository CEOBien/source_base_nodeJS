const db = require("../models");
const createError = require("http-errors");
const statusServices = {
  addStatusService: async ({ NAME, CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await db.CheckInStatus.findOne({
          where: {
            CD: CD,
            IS_DELETED: false,
          },
        });
        if (exist) {
          throw createError.NotFound("Checkin_Status CD already exists");
        }

        const add = await db.CheckInStatus.create({
          NAME: NAME,
          CD,
        });
        resolve({
          err: add ? 0 : 1,
          mess: add
            ? "Create status successfully"
            : "Error while create status",
          add,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  updateStatusService: async ({ id, NAME, CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await db.CheckInStatus.findOne({
          where: {
            CD: {
              [Op.like]: CD,
            },
            IS_DELETED: false,
          },
        });
        if (exist && exist.id != id) {
          throw createError.NotFound("Checkin_Status CD already exists");
        }
        const update = await db.CheckInStatus.update(
          {
            NAME: NAME,
            CD,
          },
          {
            where: {
              id: id,
            },
          }
        );
        resolve({
          err: update ? 0 : 1,
          mess: update
            ? "Update statsus successfully"
            : "Error while update status",
          update,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  getStatusId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const getId = await db.CheckInStatus.findOne({
          where: {
            id: id,
          },
          raw: true,
        });

        resolve({
          err: getId ? 0 : 1,
          mess: getId ? "Get list successfully" : "Error while get list",
          getId,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  getAllStatus: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const getAllstatus = await db.CheckInStatus.findAll();
        resolve({
          err: getAllstatus ? 0 : 1,
          mess: getAllstatus ? "Get list successfully" : "Error while get list",
          getAllstatus,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  deleteStatusId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteStatus = await db.CheckInStatus.destroy({
          where: { id: id },
        });
        resolve({
          err: deleteStatus ? 0 : 1,
          mess: deleteStatus
            ? "Delete stauts successfully"
            : "Error while delete status",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = statusServices;
