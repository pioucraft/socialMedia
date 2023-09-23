const express = require("express")

const router = express.Router()

router.use(express.static("./images"))

module.exports = router