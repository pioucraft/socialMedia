const query = require("../../javascript/db")
const encryption = require("../../javascript/encryption")
const getUserJs = require("../../javascript/getuser")
const crypto = require("node:crypto")


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
                    const contentLength = Buffer.byteLength(JSON.stringify(returnBody), 'utf-8');
                    let responseFromInbox = await fetchUserInbox(userFetched.inbox, {
                    method: "POST",
                    headers: {
                        "Date": date,
                        "Content-Type": "application/activity+json",
                        "Host": body.actor.split("/")[2],
                        "Signature": signature,
                        "Accept": "application/json",
                        "Digest": `SHA-256=${digest}`,
                        "Content-Length": contentLength // Add the Content-Length header
                    },
                    body: returnBody
                    })
                    console.log(responseFromInbox)
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

function fetchUserInbox(url, headers) {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous task (replace with your actual logic)
      setTimeout(() => {
        console.log(`fetch(${url}, ${JSON.stringify(headers)})`)/*.then(data => data.json()).then(data => {
            resolve(data);
        })*/
        
      }, 1000);
    });
  }

module.exports = inbox