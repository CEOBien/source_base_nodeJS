const attendanceServices = require("../services/attendanceService");
const http_errors = require("../middlewares/handle_error");
const isValidDate = require("../helpers/validateDay");
const attendanceController = {
  Checkin: async (req, res, next) => {
    try {
      const { LOCATION_ID, USER_ID, CHECKIN_TYPE_CD } = req.body;

      if (!LOCATION_ID)
        return res
          .status(400)
          .json({ err: 1, mess: "Location must not be empty" });
      if (!USER_ID) {
        return res.status(400).json({ err: 1, mess: "User not exited" });
      }
      if (!CHECKIN_TYPE_CD) {
        return res
          .status(400)
          .json({ err: 1, mess: "Checkin_Type_cd must not be empty" });
      }

      const response = await attendanceServices.checkIn(req.body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  Checkout: async (req, res, next) => {
    try {
      const { LOCATION_ID, USER_ID, CHECKOUT_TYPE_CD } = req.body;
      if (!LOCATION_ID)
        return res
          .status(400)
          .json({ err: 1, mess: "Location must not be empty" });
      if (!USER_ID) {
        return res.status(400).json({ err: 1, mess: "User not exited" });
      }
      if (!CHECKOUT_TYPE_CD) {
        return res
          .status(400)
          .json({ err: 1, mess: "Checkout_Type_cd must not be empty" });
      }

      const responsive = await attendanceServices.checkOut(req.body);
      return res.status(200).json(responsive);
    } catch (error) {
      next(error);
    }
  },
  getAllByQuery: async (req, res) => {
    try {
      const responsive = await attendanceServices.getAllByQuery(req.body);
      return res.status(200).json(responsive);
    } catch (error) {
      next(error);
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
      next(error);
    }
  },
  deleteAttendance: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(200).json("Id not extied");
      const response = await attendanceServices.deleteAttendance({ id });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  getWorkingHour: async (req, res, next) => {
    try {
      const { USER_ID, FROM_DATE, TO_DATE } = req.params;

      if (!USER_ID || !FROM_DATE || !TO_DATE)
        return res.status(400).json("Require all field must not be empty");
      if (!isValidDate(FROM_DATE) || !isValidDate(TO_DATE))
        return res.status(400).json("Date is not in the correct format");

      const response = await attendanceServices.getWorkingHours(req.params);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  countuserCheckInByDate: async (req, res, next) => {
    try {
      const DATE = req.params.DATE;
      if (!DATE) return res.status(400).json("DATE must not be empty!");
      if (!isValidDate(DATE))
        return res.status(400).json("DATE is not in the correct format");
      const response = await attendanceServices.countUserCheckedInByDate(
        req.params
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
  countuserCheckOutByDate: async (req, res, next) => {
    try {
      const DATE = req.params.DATE;
      if (!DATE) return res.status(400).json("DATE must not be empty!");
      if (!isValidDate(DATE))
        return res.status(400).json("DATE is not in the correct format");
      const response = await attendanceServices.countUserCheckedOutByDate(
        req.params
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = attendanceController;
