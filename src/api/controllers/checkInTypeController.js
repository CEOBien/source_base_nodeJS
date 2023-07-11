const checkinTypeServices = require("../services/checkInTypeService");
const http_errors = require("../middlewares/handle_error");

const statusController = {
  addCheckInType: async (req, res, next) => {
    try {
      const { NAME, CD } = req.body;
      if (!NAME)
        return res.status(400).json({ err: 1, mess: "Name must not be empty" });

      const response = await checkinTypeServices.addCheckInType(
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  updateCheckInType: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { NAME, CD } = req.body;
      if (!id) return res.status(400).json({ err: 1, mess: "Id not extied" });

      const response = await checkinTypeServices.updateCheckInTypeService({
        id,
        NAME,
      });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getCheckInTypeId: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await checkinTypeServices.getCheckInTypeId({ id });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const response = await checkinTypeServices.getAllCheckInType();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  deleteCheckInTypeId: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await checkinTypeServices.deleteCheckInTypeId({ id });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = statusController;
