const router = require("express").Router();
const cityController = require("../controllers/cityController");
const { validCity } = require("../middlewares/valid");
const authorize = require("../middlewares/authorize");

router.post(
  "/createCity",
  // authorize.authorize,
  validCity,
  cityController.createCity
);
router.get("/getAll",
  //  authorize.authorize,
  cityController.getAll);

router.get("/getCity/:id",
  //  authorize.authorize,
  cityController.getCity);
router.patch("/updateCity/:id",
  //  authorize.authorize, 
  cityController.updateCity);
router.delete(
  "/deleteCity/:id",
  // authorize.authorize,
  cityController.deleteCity
);

module.exports = router;
