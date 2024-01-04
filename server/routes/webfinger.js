const query = require("../javascript/db")

async function webfinger(req) {
    try {
        let url = decodeURIComponent(req.url)
        if(url.split("?")[1].startsWith("resource")) {
            let resource = url.split("=")[1]
            if(resource.startsWith("acct:")) {
                let account = resource.split("acct:")[1]
                let accountWithoutDomain = account.split("@")[0]
                let accountDomain = account.split("@")[1]
                let accountFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [accountWithoutDomain])).rows[0]
                if(accountFromDb && accountDomain == process.env.DOMAIN && accountFromDb.emailverification == "yes") {
                    let response = {"subject": resource, "links": [{"rel": "self", "type": "application/activity+json", "href": `${process.env.URL}/users/${accountWithoutDomain}`}]}
                    return {"message": response, status: 200}
                }
                else {
                    return {"message": "404 Not Found", status: 404}
                }
            }
            else {
                return {"message": "404 Not Found", status: 404}
            }
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", status: 500}
    }
}

module.exports = webfinger