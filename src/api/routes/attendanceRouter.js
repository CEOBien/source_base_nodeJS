<<<<<<< HEAD
const attendanceController = require("../controllers/attendanceController");
const router = require("express").Router();

router.post("/checkin", attendanceController.Checkin);
router.post("/checkout", attendanceController.Checkout);
router.get("/getall", attendanceController.getAllByQuery);
router.get("/get/:id", attendanceController.getUserId);
router.delete("/delete/:id", attendanceController.deleteAttendance);

module.exports = router;
=======
const attendanceController = require("../controllers/attendanceController");
const router = require("express").Router();

router.post("/checkin", attendanceController.Checkin);
router.post("/checkout", attendanceController.Checkout);
router.get("/getall", attendanceController.getAllByQuery);
router.get("/get/:id", attendanceController.getUserId);
router.delete("/delete/:id", attendanceController.deleteAttendance);

module.exports = router;
>>>>>>> 940cfa322083c1553083e112954f2c7a261e60d3
