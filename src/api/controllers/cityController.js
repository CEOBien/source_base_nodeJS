const createError = require("http-errors")
const createSucess = require("../helpers/createSuccess")
const cityService = require("../services/cityService")
const { Diseases } = require("../models")

const cityController = {
  createCity: async (req, res, next) => {
    try {
      const { NAME, DESC, CD, NOTE, COUNTRY_ID } = req.body

      const { status, message } = await cityService.createCity(
        {
          NAME,
          DESC,
          CD,
          NOTE,
          COUNTRY_ID,
        },
        // req?.user?.id
      )

      return res.status(status).json(createSucess(status, message))
    } catch (error) {
      next(error)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const { status, cities } = await cityService.getAll()
      res
        .status(status)
        .json(createSucess(status, "Get all cities successfully !", cities))
    } catch (error) {
      next(error)
    }
  },
  getCity: async (req, res, next) => {
    try {
      const { status, message, elements } = await cityService.getCity(
        req.params.id
      )
      res.status(status).json(createSucess(status, message, elements))
    } catch (error) {
      next(error)
    }
  },
  updateCity: async (req, res, next) => {
    try {
      const { NAME, DESC, CD, NOTE, COUNTRY_ID } = req.body
      const { id } = req.params
      const updateBy = req?.user?.id
      const city = await cityService.findCityById(id)
      if (!city) throw createError.NotFound("This city does not exist.")

      const { status, message } = await cityService.updateCity(
        NAME,
        DESC,
        CD,
        NOTE,
        COUNTRY_ID,
        id,
        updateBy
      )

      res.status(status).json(createSucess(status, message))
    } catch (error) {
      next(error)
    }
  },
  deleteCity: async (req, res, next) => {
    try {
      const { id } = req.params
      const updateBy = req?.user?.id

      const city = await cityService.findCityById(id)
      if (!city) throw createError.NotFound("This city does not exist.")

      // const existed = await Diseases.findOne({
      //   where: {
      //     DISEASE_STATUS_ID: id,
      //     IS_DELETED: false,
      //   },
      // })
      // if (existed) {
      //   throw createError.NotFound(
      //     "Current city is assigned to disease. Please unassign first."
      //   )
      // }

      const { status, message } = await cityService.deleteCity(id, updateBy)

      res.status(status).json(createSucess(status, message))
    } catch (error) {
      next(error)
    }
  },
}

module.exports = cityController

