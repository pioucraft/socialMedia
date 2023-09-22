const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    console.log("request")
    console.log(req.query)
    try {
        
        let resource = req.query.resource
        if(resource.startsWith("acct:")) {
            let account = resource.split("acct:")
            console.log(account)
        }
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router