const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    try {
        
        let resource = req.query.resource
        if(resource.startsWith("acct:")) {
            let account = resource.split("acct:")[1]
            try {
                account = account.join("acct:")
            }
            catch(err) {}
            res.send(JSON.stringify({
                "subject": resource, "links": [{"rel": "self", "type": "application/activity+json", "href": `https://${process.env.URL}/users/${account}`}]}))
        }
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router