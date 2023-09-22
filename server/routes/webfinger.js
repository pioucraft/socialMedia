const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    console.log("request")
    try {
        let resource = req.query.resource
        if(ressource.startsWith("acct:")) {
            let account = resource.split("acct:")[1].join("acct:")
            console.log(account)
        }
    }
    catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router