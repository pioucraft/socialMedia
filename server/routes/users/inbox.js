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
                    let userFetched = (await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json())
        
                    let actor = (await getUserJs.getUserAsAdmin(actor)).message
                    let activityId = `${URL}/${crypto.randomUUID()}`

                    let returnBody = {
                        "@context": "https://www.w3.org/ns/activitystreams",
                        "actor": `${URL}/users/${object.handle}`,
                        "type": "Accept",
                        "id": activityId,
                        "object": returnBody
                    }
                    const hash = crypto.createHash('sha256');
                    hash.update(JSON.stringify(returnBody), 'utf-8');
                    const digest = hash.digest('base64');
                    let headers = [
                        `(request-target): post ${userFetched.inbox.split(`https://${body.actor.split("/")[2]}`)[1]}`,
                        `digest: ${digest}`,
                        `host: ${returnBody.actor.split("/")[2]}`,
                        `date: ${date}`
                    ].join("\n")
                    let date = new Date().toUTCString()
                    let signature = await encryption.sign(returnBody, headers)
                    return {"message": "202 Accepted", "status": 202}
                }
                
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