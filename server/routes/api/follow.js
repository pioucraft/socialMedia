const query = require("../../javascript/db")
const getUserJs = require("../../javascript/getuser")
const encryption = require("../../javascript/encryption")
const crypto = require("node:crypto")

async function follow(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let token = body.token
        let user = body.user
        let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
        let trueToken = userFromDatabase.token
        if(trueToken == token) {
            if(userFromDatabase.emailverification != "yes") {
                return {"message": "401 Please Verify Your Email", "status": 401}
            }
            else {
                let userFollowing = JSON.parse(userFromDatabase.following)
                if(userFollowing == null) userFollowing = []
                console.log(userFollowing)
                let activityId = `${process.env.URL}/${crypto.randomUUID()}`
                let userFromRemote = await getUserJs.getUserAsAdmin(user)
                for(let i=0;i<userFollowing.length;i++) {
                    if(userFollowing[i].user == user) {
                        //else, unfollow
                    }
                }
                
                userFollowing.push({"id": activityId, "user": user,"accepted": false})
                //await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(userFollowing), handle])
                let requestBody = {
                    "@context": "https://www.w3.org/ns/activitystreams",
                    id: activityId,
                    type: "Follow",
                    actor: `${process.env.URL}/users/${handle}`,
                    object: userFromRemote.message.link
                }
                console.log(requestBody)
                const hash = crypto.createHash('sha256');
                hash.update(JSON.stringify(requestBody), 'utf-8');
                const digest = hash.digest('base64');
                console.log(`(request-target): post ${userFromRemote.message.inbox.split(`https://${userFromRemote.message.inbox.split("/")[2]}`)[1]}`)
                let date = new Date().toUTCString()
                let headers = [
                    `(request-target): post ${userFromRemote.message.inbox.split(`https://${userFromRemote.message.inbox.split("/")[2]}`)[1]}`,
                    `digest: SHA-256=${digest}`,
                    `host: ${userFromRemote.message.inbox.split("/")[2]}`,
                    `date: ${date}`
                ].join("\n")
                console.log(headers)
                let signature = await encryption.sign(requestBody, headers)
                console.log(signature)
                let response = (await fetch(userFromRemote.inbox, {
                    method: "POST",
                    headers: {
                        "Date": date,
                        "Content-Type": "application/activity+json",
                        "Host": body.object.split("/")[2],
                        "Signature": signature,
                        "Accept": "application/json",
                        "Digest": `SHA-256=${digest}`
                    },
                    body: JSON.stringify(requestBody)
                }))
                console.log(response)
                return {"message": "Success", "status": 200}
            }

        }
        else {
            return {"message": "401 Unauthorized", "status": 401}
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = follow