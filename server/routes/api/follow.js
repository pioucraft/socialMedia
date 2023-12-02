const query = require("../../javascript/db")
const getUserJs = require("../../javascript/getuser")
const encryption = require("../../javascript/encryption")
const crypto = require("node:crypto")

async function follow(body) {
    try {
        let handle = body.handle
        let user = body.user
        let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
        let userFollowing = JSON.parse(userFromDatabase.following)
        if(userFollowing == null) userFollowing = []
        console.log(userFollowing)
        
        for(let i=0;i<userFollowing.length;i++) {
            if(userFollowing[i].user == user) {
                return await unfollowFunction(body, i)
            }
        }
        return await followFunction(body)
        

    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

async function followFunction(body) {
    let handle = body.handle
    let user = body.user
    let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
    let userFollowing = JSON.parse(userFromDatabase.following)
    let activityId = `${process.env.URL}/${crypto.randomUUID()}`
    let userFromRemote = await getUserJs.getUserAsAdmin(user)
    userFollowing.push({"id": activityId, "user": user,"accepted": false})
    await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(userFollowing), handle])
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
    let response = (await fetch(userFromRemote.message.inbox, {
        method: "POST",
        headers: {
            "Date": date,
            "Content-Type": "application/activity+json",
            "Host": requestBody.object.split("/")[2],
            "Signature": signature,
            "Accept": "application/json",
            "Digest": `SHA-256=${digest}`
        },
        body: JSON.stringify(requestBody)
    }))
    console.log(response)
    return {"message": "Success Followed", "status": 200}
}

async function unfollowFunction(body, i) {
    let handle = body.handle
    let user = body.user
    let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
    let userFollowing = JSON.parse(userFromDatabase.following)
    let activityId = `${process.env.URL}/${crypto.randomUUID()}`
    let userFromRemote = await getUserJs.getUserAsAdmin(user)
    let newFollowing = []
    for(let j=0;j<userFollowing.length;j++) {
        if(userFollowing[j].user != user) {
            newFollowing.push(userFollowing[j])
        }
    }
    await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(newFollowing), handle])
    let requestBody = {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: activityId,
        type: "Undo",
        actor: `${process.env.URL}/users/${handle}`,
        object: {
            "@context": "https://www.w3.org/ns/activitystreams",
            id: userFollowing[i].id,
            type: "Follow",
            actor: `${process.env.URL}/users/${handle}`,
            object: userFromRemote.message.link
        }
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
    let response = (await fetch(userFromRemote.message.inbox, {
        method: "POST",
        headers: {
            "Date": date,
            "Content-Type": "application/activity+json",
            "Host": userFromRemote.message.inbox.split("/")[2],
            "Signature": signature,
            "Accept": "application/json",
            "Digest": `SHA-256=${digest}`
        },
        body: JSON.stringify(requestBody)
    }))
    console.log(response)
    return {"message": "Success Unfollowed", "status": 200}
}
module.exports = follow