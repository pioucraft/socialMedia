const query = require("../../javascript/db")
const encryption = require("../../javascript/encryption")

async function inbox(req) {
    try {
        let handle = req.url.split("/")[4]
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(handleFromDatabse && req.headers.get("content-type") == "application/activity+json") {
            let body = await req.json()
            console.log(body)
            if(body && await encryption.verifySignatureWithBody(req)) {

            }
            else {
                return {"message": "400 Bad Request", "status": 400}
            }
            //verification of signature with a function that can be accessed from anywhere. the verification function will need to check the dns too. 
        }
        else {
            return {"message": "404 Not Found", "status": 404}
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = inbox