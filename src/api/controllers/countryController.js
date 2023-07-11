const createError = require("http-errors")
const createSucess = require("../helpers/createSuccess")
const countryService = require("../services/countryService")

const countryController = {
  createCountry: async (req, res, next) => {
    try {
      const { NAME, DESC, CD, NOTE } = req.body

      const { status, message } = await countryService.createCountry(
        {
          NAME,
          DESC,
          CD,
          NOTE,
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
      const { status, countries } = await countryService.getAll()
      res
        .status(status)
        .json(createSucess(status, "Get all countries successfully !", countries))
    } catch (error) {
      next(error)
    }
  },
  getCountry: async (req, res, next) => {
    try {
      const { status, message, elements } = await countryService.getCountry(
        req.params.id
      )
      res.status(status).json(createSucess(status, message, elements))
    } catch (error) {
      next(error)
    }
  },
  updateCountry: async (req, res, next) => {
    try {
      const { NAME, DESC, CD, NOTE } = req.body
      const { id } = req.params
      const updateBy = req?.user?.id
      const country = await countryService.findCountryById(id)
      if (!country) throw createError.NotFound("This country does not exist.")

      const { status, message } = await countryService.updateCountry(
        NAME,
        DESC,
        CD,
        NOTE,
        id,
        updateBy
      )

      res.status(status).json(createSucess(status, message))
    } catch (error) {
      next(error)
    }
  },
  deleteCountry: async (req, res, next) => {
    try {
      const { id } = req.params
      const updateBy = req?.user?.id

      const country = await countryService.findCountryById(id)
      if (!country) throw createError.NotFound("This country does not exist.")

      //   const existed = await Diseases.findOne({
      //     where: {
      //       DISEASE_STATUS_ID: id,
      //       IS_DELETED: false,
      //     },
      //   })
      //   if (existed) {
      //     throw createError.NotFound(
      //       "Current country is assigned to disease. Please unassign first."
      //     )
      //   }

      const { status, message } = await countryService.deleteCountry(id, updateBy)

      res.status(status).json(createSucess(status, message))
    } catch (error) {
      next(error)
    }
  },
}

module.exports = countryController
