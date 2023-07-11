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
