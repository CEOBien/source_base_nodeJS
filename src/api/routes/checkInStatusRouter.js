const statusController = require("../controllers/checkInStatusController");
const router = require("express").Router();

router.post("/createCheckinStatus", statusController.addStatus);
router.patch("/updateCheckinStatus/:id", statusController.updateStatus);
router.get("/getCheckinStatus/:id", statusController.getStatusId);
router.get("/getall", statusController.getAll);
router.delete("/deleteCheckinStatus/:id", statusController.deleteStatusId);

module.exports = router;
