const query = require("../../javascript/db");
const encryption = require("../../javascript/encryption")
const getUserJs = require("../../javascript/getuser");
const crypto = require("node:crypto");

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
                    try {
                        console.log("following")
                        return {"message": "202 Accepted", "status": 202}
                    }
                    finally {
                        let userFetched = (await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json())
                        let actor = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
                        actor = (await getUserJs.getUserAsAdmin(actor)).message
                        let activityId = `${process.env.URL}/${crypto.randomUUID()}`

                        let returnBody = {
                            "@context": "https://www.w3.org/ns/activitystreams",
                            "actor": `${process.env.URL}/users/${handle}`,
                            "type": "Accept",
                            "id": activityId,
                            "object": body
                        }
                        const hash = crypto.createHash('sha256');
                        hash.update(JSON.stringify(returnBody), 'utf-8');
                        const digest = hash.digest('base64');
                        let date = new Date().toUTCString()
                        let headers = [
                            `(request-target): post ${userFetched.inbox.split(`https://${body.actor.split("/")[2]}`)[1]}`,
                            `digest: SHA-256=${digest}`,
                            `host: ${body.actor.split("/")[2]}`,
                            `date: ${date}`
                        ].join("\n")
                        
                        console.log(headers)
                        let signature = await encryption.sign(returnBody, headers)
                        let responseFromInboxFetch = (await fetch(userFetched.inbox, {
                            method: "POST",
                            headers: {
                                "Date": date,
                                "Content-Type": "application/activity+json",
                                "Host": body.actor.split("/")[2],
                                "Signature": signature,
                                "Accept": "application/json",
                                "Digest": `SHA-256=${digest}`
                            },
                            body: JSON.stringify(returnBody)
                        }))
                        console.log(responseFromInboxFetch)
                        let localUserFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
                        let followersString = localUserFromDb.followers
                        if(followersString == null) {
                            followersString = ""
                        }
                        followersString = followersString.split(",")
                        console.log(followersString)
                    }
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