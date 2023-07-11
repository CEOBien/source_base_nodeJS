const { logCreate, logUpdate } = require("../helpers/logQuery")
const { Cities, Countries, Districts } = require("../models")
const createError = require("http-errors")
const { Op } = require("sequelize");

const cityService = {
  createCity: async (city, createBy) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await Cities.findOne({
          where: {
            CD: city.CD,
            IS_DELETED: false,
          },
        })
        if (exist) {
          throw createError.NotFound("City CD already exists")
        }
        //check if the country is existed or not
        const existCountry = await Countries.findOne({
          where: {
            id: city.COUNTRY_ID,
            IS_DELETED: false,
          },
        })
        if (!existCountry) {
          throw createError.NotFound("Country does not exists")
        }
        await Cities.create({
          ...city,
          ...logCreate(createBy),
        })
        resolve({
          status: 201,
          message: "Create new city successfully !",
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  getAll: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const cities = await Cities.findAll({
          where: {
            IS_DELETED: false,
          },
          include: [
            {
              model: Countries,
              required: false,
              attributes: ["id", "NAME"],
              where: {
                IS_DELETED: false,
              },
            },
          ],
        })
        resolve({
          status: 200,
          cities,
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  getCity: async (cityId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const city = await Cities.findOne({
          where: {
            id: cityId,
            IS_DELETED: false,
          },
          include: [
            {
              model: Countries,
              required: false,
              attributes: ["id", "NAME"],
              where: {
                IS_DELETED: false,
              },
            },
          ],
        })
        if (city) {
          resolve({
            status: 200,
            message: "Get city successful!",
            elements: {
              city,
            },
          })
        } else {
          resolve({
            status: 400,
            message: "City does not exist!",
            elements: undefined,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  updateCity: async (NAME, DESC, CD, NOTE, COUNTRY_ID, cityId, updateBy) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await Cities.findOne({
          where: {
            CD: {
              [Op.like]: CD
            },
            IS_DELETED: false,
          },
        })
        if (exist && exist.id != cityId) {
          throw createError.NotFound("City CD already exists")
        }
        //check if the country is existed or not
        const existCountry = await Countries.findOne({
          where: {
            id: COUNTRY_ID,
            IS_DELETED: false,
          },
        })
        if (!existCountry) {
          throw createError.NotFound("Country does not exists")
        }
        const [response] = await Cities.update(
          {
            NAME,
            DESC,
            CD,
            NOTE,
            COUNTRY_ID,
            ...logUpdate(updateBy),
          },
          {
            where: {
              id: cityId,
              IS_DELETED: false,
            },
          }
        )
        if (!response) {
          resolve({
            status: 404,
            message: "City doesn't exist !",
          })
        } else {
          resolve({
            status: 200,
            message: "Update city successfully !",
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  deleteCity: async (cityId, updateBy) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [response] = await Cities.update(
          {
            IS_DELETED: true,
            ...logUpdate(updateBy),
          },
          {
            where: {
              id: cityId,
              IS_DELETED: false,
            },
          }
        )
        await Districts.update(
          {
            CITY_ID: null,
            ...logUpdate(updateBy),
          },
          {
            where: {
              CITY_ID: cityId,
              IS_DELETED: false,
            },
          }
        )
        if (!response) {
          resolve({
            status: 404,
            message: "City doesn't exist !",
          })
        } else {
          resolve({
            status: 200,
            message: "Delete city successfully !",
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  findCityById: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const city = await Cities.findOne({
          where: {
            id: id,
            IS_DELETED: false,
          },
        })
        resolve(city)
      } catch (error) {
        reject(error)
      }
    })
  },
  findCityByName: async (NAME) => {
    return new Promise(async (resolve, reject) => {
      try {
        const city = await Cities.findOne({
          where: {
            NAME: {
              [Op.like]: `%${NAME}%`
            },
            IS_DELETED: false,
          },
        })
        resolve(city)
      } catch (error) {
        reject(error)
      }
    })
  },
}

module.exports = cityService
