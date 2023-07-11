const router = require("express").Router()
const countryRouter = require("../controllers/countryController")
const { validCountry } = require("../middlewares/valid")
const authorize = require("../middlewares/authorize")

router.post(
  "/createCountry",
  // authorize.authorize,
  validCountry,
  countryRouter.createCountry
)
router.get("/getAll",
  //  authorize.authorize,
  countryRouter.getAll)

router.get("/getCountry/:id",
  // authorize.authorize,
  countryRouter.getCountry)
router.patch(
  "/updateCountry/:id",
  // authorize.authorize,
  countryRouter.updateCountry
)
router.delete(
  "/deleteCountry/:id",
  // authorize.authorize,
  countryRouter.deleteCountry
)

module.exports = router
