const query = require("../../../javascript/db");
const crypto = require("node:crypto");
const encryption = require("../../../javascript/encryption")

async function follow(body, handle) {
    try {
        console.log("following")
        return {"message": "202 Accepted", "status": 202}
    }
    finally {
        let userFetched = (await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json())
        let actorHandle = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
        let localUserFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
        let followersString = localUserFromDb.followers
        
        //generate the fetch body 
        let activityId = `${process.env.URL}/${crypto.randomUUID()}`
        let returnBody = {
            "@context": "https://www.w3.org/ns/activitystreams",
            "actor": `${process.env.URL}/users/${handle}`,
            "type": "Accept",
            "id": activityId,
            "object": body
        }

        //generate the hash
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(returnBody), 'utf-8');
        const digest = hash.digest('base64');

        //generate the signature
        let date = new Date().toUTCString()
        let headers = [
            `(request-target): post ${userFetched.inbox.split(`https://${body.actor.split("/")[2]}`)[1]}`,
            `digest: SHA-256=${digest}`,
            `host: ${body.actor.split("/")[2]}`,
            `date: ${date}`
        ].join("\n")
        let signature = await encryption.sign(returnBody, headers)
        
        //send the accept response
        await fetch(userFetched.inbox, {
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
        })


        let followers = JSON.parse(followersString) ?? []
        console.log(followers)
        if(followersString != null) {
            //if the followers list isn't empty
            
            let userIsAlreadyFollowed = false
            for(let i=0; i<followers.length;i++) {
                //check if the user is already followed. If yes, add the new id to the ids list
                if(followers[i].user == actorHandle) {
                    followers[i].id.push(body.id)
                    userIsAlreadyFollowed = true
                    break;
                }
            }
            if(!userIsAlreadyFollowed) {
                followers.push({"id":[body.id], "user": actorHandle})
            }
            
        }

        followersString = JSON.stringify(followers)
        await query("UPDATE Users SET followers = $1 WHERE handle = $2", [followersString, handle])
    }
}

module.exports = follow