

const express = require("express")
const createAccount = require("./api/createAccount")

const router = express.Router()

router.use("/createAccount", createAccount)

module.exports = router
