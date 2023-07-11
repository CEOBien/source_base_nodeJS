<<<<<<< HEAD
const checkinTypeServices = require("../services/checkInTypeService");
const http_errors = require("../middlewares/handle_error");

const statusController = {
  addCheckInType: async (req, res) => {
    try {
      const { NAME, CD } = req.body;
      if (!NAME)
        return res.status(400).json({ err: 1, mess: "Name must not be empty" });

      const response = await checkinTypeServices.addCheckInTypeService(
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },

  updateCheckInType: async (req, res) => {
    try {
      const id = req.params.id;
      const { NAME, CD } = req.body;
      if (!id)
        return res.status(400).json({ err: 1, mess: "Id not extied" });

      const response = await checkinTypeServices.updateCheckInTypeService({
        id,
        NAME,
      });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  getCheckInTypeId: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id)
        return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await checkinTypeServices.getCheckInTypeId({ id });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  getAll: async (req, res) => {
    try {
      const response = await checkinTypeServices.getAllCheckInType();
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },

  deleteCheckInTypeId: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id)
        return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await checkinTypeServices.deleteCheckInTypeId({ id });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
};
module.exports = statusController;
=======
const checkinTypeServices = require("../services/checkInTypeService");
const http_errors = require("../middlewares/handle_error");

const statusController = {
  addCheckInType: async (req, res) => {
    try {
      const { NAME, CD } = req.body;
      if (!NAME)
        return res.status(400).json({ err: 1, mess: "Name must not be empty" });

      const response = await checkinTypeServices.addCheckInTypeService(
        req.body
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },

  updateCheckInType: async (req, res) => {
    try {
      const id = req.params.id;
      const { NAME, CD } = req.body;
      if (!id)
        return res.status(400).json({ err: 1, mess: "Id not extied" });

      const response = await checkinTypeServices.updateCheckInTypeService({
        id,
        NAME,
      });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  getCheckInTypeId: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id)
        return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await checkinTypeServices.getCheckInTypeId({ id });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  getAll: async (req, res) => {
    try {
      const response = await checkinTypeServices.getAllCheckInType();
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },

  deleteCheckInTypeId: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id)
        return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await checkinTypeServices.deleteCheckInTypeId({ id });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
};
module.exports = statusController;
>>>>>>> 940cfa322083c1553083e112954f2c7a261e60d3
