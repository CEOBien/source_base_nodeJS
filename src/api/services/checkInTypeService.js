<<<<<<< HEAD
const db = require("../models");

const CheckInTypeServices = {
  addCheckInTypeService: async ({ NAME, CD }) => {
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
          throw createError.NotFound("Checkin_Type CD already exists");
        }

        const add = await db.CheckInType.create({
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

  updateCheckInTypeService: async ({ id, NAME, CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await db.CheckInType.findOne({
          where: {
            CD: {
              [Op.like]: CD,
            },
            IS_DELETED: false,
          },
        });
        if (exist && exist.id != id) {
          throw createError.NotFound("Checkin_Type CD already exists");
        }
        const update = await db.CheckInType.update(
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

  getCheckInTypeId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const getId = await db.CheckInType.findOne({
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

  getAllCheckInType: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const getAll = await db.CheckInType.findAll();
        resolve({
          err: getAll ? 0 : 1,
          mess: getAll ? "Get list successfully" : "Error while get list",
          getAll,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  deleteCheckInTypeId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteType = await db.CheckInType.destroy({
          where: { id: id },
        });
        resolve({
          err: deleteType ? 0 : 1,
          mess: deleteType
            ? "Delete stauts successfully"
            : "Error while delete status",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = CheckInTypeServices;
=======
const db = require("../models");

const CheckInTypeServices = {
  addCheckInTypeService: async ({ NAME, CD }) => {
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
          throw createError.NotFound("Checkin_Type CD already exists");
        }

        const add = await db.CheckInType.create({
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

  updateCheckInTypeService: async ({ id, NAME, CD }) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await db.CheckInType.findOne({
          where: {
            CD: {
              [Op.like]: CD,
            },
            IS_DELETED: false,
          },
        });
        if (exist && exist.id != id) {
          throw createError.NotFound("Checkin_Type CD already exists");
        }
        const update = await db.CheckInType.update(
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

  getCheckInTypeId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const getId = await db.CheckInType.findOne({
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

  getAllCheckInType: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const getAll = await db.CheckInType.findAll();
        resolve({
          err: getAll ? 0 : 1,
          mess: getAll ? "Get list successfully" : "Error while get list",
          getAll,
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  deleteCheckInTypeId: async ({ id }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleteType = await db.CheckInType.destroy({
          where: { id: id },
        });
        resolve({
          err: deleteType ? 0 : 1,
          mess: deleteType
            ? "Delete stauts successfully"
            : "Error while delete status",
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = CheckInTypeServices;
>>>>>>> 940cfa322083c1553083e112954f2c7a261e60d3
