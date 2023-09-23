const express = require("express")

const createAccount = require("./api/createAccount")
const verifyEmail = require("./api/verifyEmail")
const sendVerificationEmail = require("./api/sendVerificationEmail")
const changeUsername = require("./api/changeUsername")
const changeEmail = require("./api/changeEmail")
const changeBio = require("./api/changeBio")
const uploadImage = require("./api/uploadImage")
const changePassword = require("./api/changePassword")
const login = require("./api/login")
const changeProfilePicture = require("./api/changeProfilePicture")
const images = require("./api/images")

const router = express.Router()

router.use("/createAccount", createAccount)
router.use("/verifyEmail", verifyEmail)
router.use("/sendVerificationEmail", sendVerificationEmail)
router.use("/changeUsername", changeUsername)
router.use("/changeEmail", changeEmail)
router.use("/changeBio", changeBio)
router.use("/uploadImage", uploadImage)
router.use("/changePassword", changePassword)
router.use("/login", login)
router.use("/changeProfilePicture", changeProfilePicture)
router.use("/images", images)


module.exports = router
