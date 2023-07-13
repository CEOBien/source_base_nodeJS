const attendanceController = require("../controllers/attendanceController");
const router = require("express").Router();

router.post("/checkIn", attendanceController.Checkin);
router.post("/checkOut", attendanceController.Checkout);
router.get("/getAll", attendanceController.getAllByQuery);
router.get("/get/:id", attendanceController.getUserId);
router.delete("/delete/:id", attendanceController.deleteAttendance);
router.get(
  "/getWorkingHour/:USER_ID/:FROM_DATE/:TO_DATE",
  attendanceController.getWorkingHour
);
router.get(
  "/countUserCheckInByDate/:DATE",
  attendanceController.countuserCheckInByDate
);
router.get(
  "/countUserCheckOutByDate/:DATE",
  attendanceController.countuserCheckOutByDate
);

module.exports = router;
