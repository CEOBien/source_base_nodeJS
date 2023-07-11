<<<<<<< HEAD
const router = require("express").Router();
const checkInTypeController = require("../controllers/checkInTypeController");

router.post("/createCheckinType", checkInTypeController.addCheckInType);
router.patch("/updateCheckinType/:id", checkInTypeController.updateCheckInType);
router.get("/getCheckinType/:id", checkInTypeController.getCheckInTypeId);
router.get("/getall", checkInTypeController.getAll);
router.delete(
  "/deleteCheckinType/:id",
  checkInTypeController.deleteCheckInTypeId
);
module.exports = router;
=======
const router = require("express").Router();
const checkInTypeController = require("../controllers/checkInTypeController");

router.post("/createCheckinType", checkInTypeController.addCheckInType);
router.patch("/updateCheckinType/:id", checkInTypeController.updateCheckInType);
router.get("/getCheckinType/:id", checkInTypeController.getCheckInTypeId);
router.get("/getall", checkInTypeController.getAll);
router.delete(
  "/deleteCheckinType/:id",
  checkInTypeController.deleteCheckInTypeId
);
module.exports = router;
>>>>>>> 940cfa322083c1553083e112954f2c7a261e60d3
