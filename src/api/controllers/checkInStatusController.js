const statusServices = require("../services/checkInStatusService");


const statusController = {
  addStatus: async (req, res, next) => {
    try {
      const { NAME, CD } = req.body;
      if (!NAME)
        return res.status(400).json({ err: 1, mess: "Name must not be empty" });

      const response = await statusServices.addStatusService(req.body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { NAME, CD } = req.body;
      if (!id) return res.status(400).json({ err: 1, mess: "Id not extied" });

      const response = await statusServices.updateStatusService({
        id,
        NAME,
      });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getStatusId: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ err: 1, mess: "Id not extied" });
      const response = await statusServices.getStatusId({ id });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getAll: async (req, res, next) => {
    try {
      const response = await statusServices.getAllStatus();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  deleteStatusId: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ err: 1, mess: "Id not exited" });
      const response = await statusServices.deleteStatusId({ id });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = statusController;
