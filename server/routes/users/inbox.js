const query = require("../../javascript/db")
const encryption = require("../../javascript/encryption")

async function inbox(req) {
    try {
        let body = await req.json()
        console.log(body)
        let handle = req.url.split("/")[4]
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(handleFromDatabse && req.headers.get("content-type") == "application/activity+json") {
            console.log("ah")
            if(await encryption.verifySignature(req, body)) {
                
                
                console.log(body)
                if(body.type == "Follow") {
                    console.log("following")
                    let object = (await query("SELECT * FROM Users WHERE handle = $1", [body.object.split("/")[4]])).rows[0]
                    console.log(object.handle)
                }
                return {"message": "200 ahhhhh", "status": 200}
            }
            else {
                return {"message": "400 Bad Request", "status": 400}
            }
        }
        else {
            return {"message": "404 Not Found", "status": 404}
        }
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = inbox