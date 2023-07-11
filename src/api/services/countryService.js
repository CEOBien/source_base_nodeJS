const { logCreate, logUpdate } = require("../helpers/logQuery")
const { Countries, Cities } = require("../models")
const createError = require("http-errors")

const { Op } = require("sequelize");

const countryService = {
  createCountry: async (country, createBy) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await Countries.findOne({
          where: {
            CD: country.CD,
            IS_DELETED: false,
          },
        })
        if (exist) {
          throw createError.NotFound("Country CD already exists")
        }
        await Countries.create({
          ...country,
          ...logCreate(createBy),
        })
        resolve({
          status: 201,
          message: "Create new country successfully !",
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  getAll: async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const countries = await Countries.findAll({
          where: {
            IS_DELETED: false,
          },
          include: [
            {
              model: Cities,
              required: false,
              attributes: ["id", "CD", "NAME", "DESC"],
              where: {
                IS_DELETED: false,
              },
            },
          ],
        })
        resolve({
          status: 200,
          countries,
        })
      } catch (error) {
        reject(error)
      }
    })
  },
  getCountry: async (countryId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const country = await Countries.findOne({
          where: {
            id: countryId,
            IS_DELETED: false,
          },
          include: [
            {
              model: Cities,
              required: false,
              attributes: ["id", "CD", "NAME", "DESC"],
              where: {
                IS_DELETED: false,
              },
            },
          ],
        })
        if (country) {
          resolve({
            status: 200,
            message: "Get country successful!",
            elements: {
              country,
            },
          })
        } else {
          resolve({
            status: 400,
            message: "Country does not exist!",
            elements: undefined,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  updateCountry: async (NAME, DESC, CD, NOTE, countryId, updateBy) => {
    return new Promise(async (resolve, reject) => {
      try {
        //check if the code is existed or not
        const exist = await Countries.findOne({
          where: {
            CD: {
              [Op.like]: CD
            },
            IS_DELETED: false,
          },
        })
        if (exist && exist.id != countryId) {
          throw createError.NotFound("Country CD already exists")
        }
        const [response] = await Countries.update(
          {
            NAME,
            DESC,
            CD,
            NOTE,
            ...logUpdate(updateBy),
          },
          {
            where: {
              id: countryId,
              IS_DELETED: false,
            },
          }
        )
        if (!response) {
          resolve({
            status: 404,
            message: "Country doesn't exist !",
          })
        } else {
          resolve({
            status: 200,
            message: "Update country successfully !",
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  deleteCountry: async (countryId, updateBy) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [response] = await Countries.update(
          {
            IS_DELETED: true,
            ...logUpdate(updateBy),
          },
          {
            where: {
              id: countryId,
              IS_DELETED: false,
            },
          }
        )
        await Cities.update(
          {
            COUNTRY_ID: null,
            ...logUpdate(updateBy),
          },
          {
            where: {
              COUNTRY_ID: countryId,
              IS_DELETED: false,
            },
          }
        )
        if (!response) {
          resolve({
            status: 404,
            message: "Country doesn't exist !",
          })
        } else {
          resolve({
            status: 200,
            message: "Delete country successfully !",
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  },
  findCountryById: async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(id)
        const country = await Countries.findOne({
          where: {
            id,
            IS_DELETED: false,
          },
        })
        resolve(country)
      } catch (error) {
        reject(error)
      }
    })
  },
  findCountryByCD: async (CD) => {
    return new Promise(async (resolve, reject) => {
      try {
        const country = await Countries.findOne({
          where: {
            CD: {
              [Op.like]: CD
            },
            IS_DELETED: false,
          },
        })
        resolve(country)
      } catch (error) {
        reject(error)
      }
    })
  },
}

module.exports = countryService
