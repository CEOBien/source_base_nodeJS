const attendanceServices = require("../services/attendanceService");
const http_errors = require("../middlewares/handle_error");

const attendanceController = {
  Checkin: async (req, res) => {
    try {
      const { LOCATION_ID, USER_ID, CHECKIN_TYPE_ID } = req.body;

      if (!LOCATION_ID)
        return res
          .status(400)
          .json({ err: 1, mess: "Location must not be empty" });
      if (!USER_ID) {
        return res.status(400).json({ err: 1, mess: "User not exited" });
      }
      if (!CHECKIN_TYPE_ID) {
        return res
          .status(400)
          .json({ err: 1, mess: "Checkin_Type_Id must not be empty" });
      }

      const response = await attendanceServices.checkIn(req.body);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },

  Checkout: async (req, res) => {
    try {
      const { LOCATION_ID, USER_ID, CHECKIN_TYPE_ID } = req.body;
      console.log(CHECKIN_TYPE_ID, LOCATION_ID);
      if (!LOCATION_ID)
        return res
          .status(400)
          .json({ err: 1, mess: "Location must not be empty" });
      if (!USER_ID) {
        return res.status(400).json({ err: 1, mess: "User not exited" });
      }
      if (!CHECKIN_TYPE_ID) {
        return res.status(400).json({ err: 1, mess: "Type must not be empty" });
      }

      const responsive = await attendanceServices.checkOut(req.body);
      return res.status(200).json(responsive);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  getAllByQuery: async (req, res) => {
    try {
      const responsive = await attendanceServices.getAllByQuery(req.body);
      return res.status(200).json(responsive);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  getUserId: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json("ID not exited!");
      }
      const response = await attendanceServices.getUserId({ id });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
  deleteAttendance: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(200).json("Id not extied");
      const response = await attendanceServices.deleteAttendance({ id });
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      http_errors.internalServerError(res);
    }
  },
};
module.exports = attendanceController;
