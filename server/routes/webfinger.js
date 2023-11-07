const express = require("express")
const router = express.Router()
const query = require("../javascript/db")

async function webfinger(req) {
    try {
        let resource = req.url.split("=")[1]
        if(resource.startsWith("acct:")) {
            let account = resource.split("acct:")[1]
            let accountWithoutDomain = account.split("@")[0]
            let accountDomain = account.split("@")[1]
            let accountFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [accountWithoutDomain])).rows[0]
            console.log(accountFromDb)
            console.log(accountDomain)
            if(accountFromDb && accountDomain == process.env.DOMAIN && accountFromDb.emailverification == "yes") {
                return JSON.stringify({"subject": resource, "links": [{"rel": "self", "type": "application/activity+json", "href": `${process.env.URL}/users/${accountWithoutDomain}`}]})
            }
            else {
                return {"message": "404 Not Found", "code": 404}
            }
        }
        else {
            return {"message": "404 Not Found", "code": 404}
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "code": 500}
    }
}

module.exports = webfinger