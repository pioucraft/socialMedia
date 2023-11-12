const query = require("../../javascript/db")
const sanitize = require("sanitize-html")
const encryption = require("../../javascript/encryption")

async function getUser(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let token = body.token
        let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
        if(trueToken == token) {
            if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                return {"message": "401 Please Verify Your Email", "status": 401}
            }
            else {
                let user = body.user
                return await getUserAsAdmin(user)
                // request the user with getuserasadmin function and return the interesting object or idk what
            }

        }
        else {
            return {"message": "401 Unauthorized", "status": 401}
        }
}
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

async function getUserAsAdmin(user) {
    try {
        let userSDomain = user.split("@")[1]
        if(!userSDomain) {
            let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [user])).rows[0]
            if(userFromDatabase) {
                userFromDatabase.privatekeypem = null
                userFromDatabase.token = null
                userFromDatabase.password = null
                userFromDatabase.lastverificationemailsent = null
                userFromDatabase.email = null
                return {"message": userFromDatabase, "status": 200}
            }
            else {
                return {"message": "404 Not Found", "status": 404}
            }
        }
        else {
            let date = new Date()
            let userFromDatabase = (await query("SELECT * FROM remoteUsers WHERE handle = $1", [user])).rows[0]
            if(userFromDatabase && parseInt(parseInt(userFromDatabase.lastfetch) + 1000 * 100) > parseInt(date.getTime())) {
                console.log("hahah just get the user from database")
                return {"message": userFromDatabase, "status": 200}
            }
            else {
                console.log("hahaha you gotta update the database !!!!!!")
                return fetchUser(user)
            }
        }
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

async function fetchUser(user) {
    let userSDomain = user.split("@")[1]
    let userWithoutDomain = user.split("@")[0]
    let userWebfinger = await (await fetch(`https://${userSDomain}/.well-known/webfinger?resource=acct:${userWithoutDomain}@${userSDomain}`)).json()
    let userLink = ""
    for(let i = 0;i<userWebfinger.links.length;i++) {
        if(userWebfinger.links[i].rel == "self" && userWebfinger.links[i].type == "application/activity+json") {
            userLink = userWebfinger.links[i].href
            break;
        }
    }


    //finish the fetching with the signature
    //add the fetched data to the database and return it
    //read documentation for the activitystreams collections
    //then use the getUserAsAdmin function with the file inbox.js. It will be used when someone follows an account on this server
    //when following an account on the same server, don't use activitypub. It's stupid, just use local api or something
    //when someone tries to follow on the same server. check the domains and prevent the person from doing it using activitypub. When you follow on the same server, you don't have to specify a domain name
    let date = new Date()
    let signature = await encryption.signWithoutBody("admin", "(request-target) host date accept", userLink, date)
    let userPage = await (await fetch(userLink, {headers: {"Accept": "application/activity+json, application/ld+json", "Signature": signature}})).json()
    let returnStatement = {}
    returnStatement.handle = sanitize(user)
    if(userPage.preferedUsername) {
        returnStatement.username = sanitize(userPage.preferedUsername)
    }
    if(userPage.summary) {
        returnStatement.bio = sanitize(userPage.summary)
    }
    returnStatement.link = sanitize(userLink)
    returnStatement.inbox = sanitize(userPage.inbox)
    returnStatement.outbox = sanitize(userPage.outbox)
    if(userPage.icon) {
        returnStatement.profilePicture = userPage.icon.url
    }
    if(userPage.publicKey.id == `${userLink}#main-key` || userPage.publicKey.id == `${userLink}/#main-key`) {
        returnStatement.publicKey = userPage.publicKey.publicKeyPem
    }
    returnStatement.lastfetch = date.getTime()
    try {
        await query("DELETE FROM RemoteUsers WHERE handle = $2;", [user])
    }
    catch(err) {

    }
    
    await query("INSERT INTO RemoteUsers (handle, username, bio, link, inbox, outbox, profilePicture, publicKeyPem, lastfetch) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [returnStatement.handle, returnStatement.username, returnStatement.bio, returnStatement.link, returnStatement.inbox, returnStatement.outbox, returnStatement.profilePicture, returnStatement.publicKey, returnStatement.lastfetch])
    
    return {"message": returnStatement, "status": 200}
}

module.exports = {"getUser": getUser, "getUserAsAdmin": getUserAsAdmin}
