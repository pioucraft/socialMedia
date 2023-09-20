const express = require("express")

const createAccount = require("./api/createAccount")
const verifyEmail = require("./api/verifyEmail")
const sendVerificationEmail = require("./api/sendVerificationEmail")
const changeUsername = require("./api/changeUsername")
const changeEmail = require("./api/changeEmail")
const changeBio = require("./api/changeBio")


const router = express.Router()

router.use("/createAccount", createAccount)
router.use("/verifyEmail", verifyEmail)
router.use("/sendVerificationEmail", sendVerificationEmail)
router.use("/changeUsername", changeUsername)
router.use("/changeEmail", changeEmail)
router.use("/changeBio", changeBio)


module.exports = router
