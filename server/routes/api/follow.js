const query = require("../../javascript/db")
const getUserJs = require("../../javascript/getuser")
const encryption = require("../../javascript/encryption")
const crypto = require("node:crypto")

async function follow(body) {
    let handle = body.handle
    let user = body.user
    let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
    let userFollowing = JSON.parse(userFromDatabase.following) ?? []
    let userFromRemote = await getUserJs.getUserAsAdmin(user)
    let activityId = `${process.env.URL}/${crypto.randomUUID()}`
    
    //check if you need to follow or to unfollow
    for(let i=0;i<userFollowing.length;i++) {
        if(userFollowing[i].user == user) {
            return await unfollowFunction(i, handle, user, userFollowing, userFromRemote, activityId)
        }
    }
    return await followFunction(handle, user, userFollowing, userFromRemote, activityId)
        
}

async function followFunction(handle, user, userFollowing, userFromRemote, activityId) {
    //add the followed user to the database
    userFollowing.push({"id": activityId, "user": user,"accepted": false})
    await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(userFollowing), handle])

    //create headers and things like that
    let requestBody = {
        "@context": "https://www.w3.org/ns/activitystreams",
        id: activityId,
        type: "Follow",
        actor: `${process.env.URL}/users/${handle}`,
        object: userFromRemote.message.link
    }

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(requestBody), 'utf-8');
    const digest = hash.digest('base64');
    let date = new Date().toUTCString()

    let headers = [
        `(request-target): post ${userFromRemote.message.inbox.split(`https://${userFromRemote.message.inbox.split("/")[2]}`)[1]}`,
        `digest: SHA-256=${digest}`,
        `host: ${userFromRemote.message.inbox.split("/")[2]}`,
        `date: ${date}`
    ].join("\n")

    let signature = await encryption.sign(requestBody, headers)

    //send the follow request to the server
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
    return {"message": "Success Followed", "status": 200}
}

async function unfollowFunction(i, handle, user, userFollowing, userFromRemote, activityId) {
    //remove the followed user from the database
    let newFollowing = []
    for(let j=0;j<userFollowing.length;j++) {
        if(userFollowing[j].user != user) {
            newFollowing.push(userFollowing[j])
        }
    }
    await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(newFollowing), handle])
    
    //create the request headers and things like that
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

    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(requestBody), 'utf-8');
    const digest = hash.digest('base64');
    let date = new Date().toUTCString()

    let headers = [
        `(request-target): post ${userFromRemote.message.inbox.split(`https://${userFromRemote.message.inbox.split("/")[2]}`)[1]}`,
        `digest: SHA-256=${digest}`,
        `host: ${userFromRemote.message.inbox.split("/")[2]}`,
        `date: ${date}`
    ].join("\n")

    let signature = await encryption.sign(requestBody, headers)

    //send the unfollow to the server
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
    return {"message": "Success Unfollowed", "status": 200}
}
module.exports = follow