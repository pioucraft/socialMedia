const express = require("express")
const router = express.Router()
const query = require("../javascript/db")

router.get("/", async (req, res) => {
    try {
        console.log("request")
        let resource = req.query.resource
        if(resource.startsWith("acct:")) {
            let account = resource.split("acct:")[1]
            let accountWithoutDomain = account.split("@")[0]
            let accountDomain = account.split("@")[1]
            let accountFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [accountWithoutDomain])).rows[0]
            //!!!!! problem to fix !!!!! the accountDomain does not contain the "https://" but the thing in env does contain it. Add a new thing in env without the "https://"!!!!
            //!!!!! problem to fix !!!!! it does not check if the email was verified. It's a problem !!!!!
            if(accountFromDb && accountDomain == process.env.URL) {
                res.send({"subject": resource, "links": [{"rel": "self", "type": "application/activity+json", "href": `https://${process.env.URL}/users/${accountWithoutDomain}`}]})
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