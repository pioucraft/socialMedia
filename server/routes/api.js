const express = require("express")

const createAccount = require("./api/createAccount")
const verifyEmail = require("./api/verifyEmail")
const sendVerificationEmail = require("./api/sendVerificationEmail")

const router = express.Router()

router.use("/createAccount", createAccount)
router.use("/verifyEmail", verifyEmail)
router.use("/sendVerificationEmail", sendVerificationEmail)

module.exports = router
