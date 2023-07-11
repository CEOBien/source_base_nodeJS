const attendanceController = require("../controllers/attendanceController");
const router = require("express").Router();

router.post("/checkIn", attendanceController.Checkin);
router.post("/checkOut", attendanceController.Checkout);
router.get("/getAll", attendanceController.getAllByQuery);
router.get("/get/:id", attendanceController.getUserId);
router.delete("/delete/:id", attendanceController.deleteAttendance);

module.exports = router;
