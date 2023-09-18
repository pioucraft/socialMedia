const express = require("express")
const createAccount = require("./api/createAccount")
const verifyEmail = require("./api/verifyEmail")

const router = express.Router()

router.use("/createAccount", createAccount)
router.use("/verifyEmail", verifyEmail)


module.exports = router
