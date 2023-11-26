const query = require("../../javascript/db");
const encryption = require("../../javascript/encryption")
const getUserJs = require("../../javascript/getuser");
const crypto = require("node:crypto");
const sanitize = require("sanitize-html")

async function inbox(req) {
    try {
        let bodyString = (await Bun.readableStreamToText(req.body))
        let body = JSON.parse(bodyString)
        console.log(body)
        let handle = req.url.split("/")[4]
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(handleFromDatabse) {
            console.log("ah")
            console.log(JSON.stringify(body.object.replies))
            if(await encryption.verifySignature(req, bodyString)) {
                console.log(body)
                if(body.type == "Undo") {
                    if(body.object.type == "Follow") {
                        let localUserFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
                        let followers = JSON.parse(localUserFromDb.followers)
                        let newFollowers = []
                        for(let i=0;i<followers.length;i++) {
                            if(!followers[i].id.includes(body.object.id)) {
                                newFollowers.push(followers[i])
                            }
                        }
                        await query("UPDATE Users SET followers = $1 WHERE handle = $2", [JSON.stringify(newFollowers), handle])
                        return {"message": "202 Accepted", "status": 202}
                    }
                    
                }
                else if(body.type == "Follow") {
                    try {
                        console.log("following")
                        return {"message": "202 Accepted", "status": 202}
                    }
                    finally {
                        let userFetched = (await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json())
                        let actorHandle = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
                        let localUserFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
                        let followersString = localUserFromDb.followers
                        
                        
                        
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
                        if(followersString != null) {
                            followersTemporaryString = JSON.parse(followersString)
                            for(let i=0; i<followersTemporaryString.length;i++) {
                                if(followersTemporaryString[i].user == actorHandle) {
                                    followersTemporaryString[i].id.push(body.id)
                                    followersString = JSON.stringify(followersTemporaryString)
                                    await query("UPDATE Users SET followers = $1 WHERE handle = $2", [followersString, handle])
                                    return
                                }
                            }
                        }
                        if(followersString == null) {
                            followersString = [{"id": [body.id], "user": actorHandle}]
                        }
                        else {
                            followersString = JSON.parse(followersString)
                            
                            followersString.push({"id":[body.id], "user": actorHandle})
                        }
                        followersString = JSON.stringify(followersString)
                        console.log(followersString)
                        await query("UPDATE Users SET followers = $1 WHERE handle = $2", [followersString, handle])
                    }
                }
                else if(body.type == "Accept") {
                    if(body.object.type == "Follow") {
                        
                        let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
                        let userFollowing = JSON.parse(userFromDatabase.following)
                        for(let i=0;i<userFollowing.length;i++) {
                            if(userFollowing[i].id == body.object.id) {
                                console.log(userFromDatabase)
                                console.log("something")
                                userFollowing[i].accepted = true
                                console.log(userFollowing)
                                await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(userFollowing), req.url.split("/")[4]])
                                return {"message": "200 Success", "status": 200}
                            }
                        }
                        
                    
                    }
                }
                else if(body.type == "Create") {
                    if(body.object.type == "Note") {
                        console.log(JSON.stringify(body.object.replies))
                        
                        console.log("passed verification of signature and is a post")
                        let userFetched = (await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json())
                        let authorHandle = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
                        let author = await getUserJs.getUserAsAdmin(authorHandle)
                        let date = new Date()
                        console.log(authorHandle)
                        console.log(author)
                        authorHandle = author.message.handle
                        let postDate = date.getTime()
                        let link = sanitize(body.object.id)
                        let content = sanitize(body.object.content)
                        if(JSON.parse(handleFromDatabse.following).includes(authorHandle)) {
                            console.log(authorHandle)
                            console.log(postDate)
                            console.log(link)
                            console.log(content)
                            let response = (await query("INSERT INTO RemotePosts (author, content, link, date, likes, boosts) VALUES ($1, $2, $3, $4, 0, 0)", [authorHandle, content, link, postDate]))
                            console.log(response)
                            return {"message": "202 Accepted", "status": 202}
                        }
                        else {
                            return {"message": "400 Bad Request", "status": 400}
                        }
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