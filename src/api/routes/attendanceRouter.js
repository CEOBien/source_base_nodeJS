const attendanceController = require("../controllers/attendanceController");
const router = require("express").Router();

router.post("/checkin", attendanceController.Checkin);
router.post("/checkout", attendanceController.Checkout);
router.get("/getall", attendanceController.getAllByQuery);
router.get("/get/:id", attendanceController.getUserId);
router.delete("/delete/:id", attendanceController.deleteAttendance);

module.exports = router;
