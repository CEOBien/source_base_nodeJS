const router = require("express").Router()
const authController = require("../controllers/authController")
const { validLogin } = require("../middlewares/valid")
const { verifyRefreshToken } = require("../middlewares/verify")
// const authorize = require("../middlewares/authorize")

router.post("/login", validLogin, authController.login)
router.get("/refreshToken", verifyRefreshToken, authController.refreshToken)
router.get("/logout", authController.logout)


module.exports = router
