const express = require("express")
const router = express.Router()
const query = require("../javascript/db")

router.get("/", async (req, res) => {
    try {
        
        let resource = req.query.resource
        if(resource.startsWith("acct:")) {
            let account = resource.split("acct:")[1]
            let accountWithoutDomain = account.split("@")[0]
            let accountFromDb = await query("SELECT * FROM Users WHERE handle = $1", [accountWithoutDomain]).rows[0]
            if(accountFromDb) {
                res.send({"subject": resource, "links": [{"rel": "self", "type": "application/activity+json", "href": `https://${process.env.URL}/users/${account}`}]})
            }
            else {
                res.status(404).send("")
            }
        }
    }
    catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router