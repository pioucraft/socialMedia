const query = require("./db")
const sanitize = require("sanitize-html")

async function getUserAsAdmin(user) {
    try {
        let userSDomain = user.split("@")[1]

        //if there isn't a domain name in the user, it means it's a local use
        if(!userSDomain) {
            let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [user])).rows[0]
            if(userFromDatabase) {
                //remove sensitive informations
                [
                    userFromDatabase.privatekeypem,
                    userFromDatabase.token,
                    userFromDatabase.password,
                    userFromDatabase.lastverificationemailsent,
                    userFromDatabase.email
                ] = [null, null, null, null, null]
                

                return {"message": userFromDatabase, "status": 200}
            }
            else {
                //if the user doesn't exist, it doesn't exist
                return {"message": "404 Not Found", "status": 404}
            }
        }

        //if there's a domain name, the user is a remote user
        else {
            //check if the user has been fetched for the last time at least less 24 hours ago
            let date = new Date()
            let userFromDatabase = (await query("SELECT * FROM remoteUsers WHERE handle = $1", [user])).rows[0] 
            let wasTheUserFetchedInTheLast24Hours = parseInt(parseInt((userFromDatabase ?? {}).lastfetch ?? "0")+1000*60*60*24) > parseInt(date.getTime())
            if(userFromDatabase && wasTheUserFetchedInTheLast24Hours) {
                return {"message": userFromDatabase, "status": 200}
            }
            //or else you refetch it
            else {
                return fetchUser(user)
            }
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

async function fetchUser(user) {
    //define the domain name and the username and fetch the webfinger
    let userSDomain = user.split("@")[1]
    let userWithoutDomain = user.split("@")[0]
    let userWebfinger = await (await fetch(`https://${userSDomain}/.well-known/webfinger?resource=acct:${userWithoutDomain}@${userSDomain}`)).json()
    
    //fetch the link to acces the user page using webfinger
    let userLink = ""
    for(let i = 0;i<userWebfinger.links.length;i++) {
        if(userWebfinger.links[i].rel == "self" && userWebfinger.links[i].type == "application/activity+json") {
            userLink = userWebfinger.links[i].href
            break;
        }
    }


    //fetch the user page and initialize the return statement
    let userPage = await (await fetch(userLink, {headers: {"Accept": "application/activity+json, application/ld+json"}})).json()
    let returnStatement = {}
    //define returnStatement with correct values
    let date = new Date()

    [
        returnStatement.lastfetch, 
        returnStatement.handle, 
        returnStatement.link,
        returnStatement.inbox,
        returnStatement.outbox,
        returnStatement.username,
        returnStatement.bio,
        returnStatement.profilepicture
    ] = [
        date.getTime(),
        sanitize(user),
        sanitize(userLink),
        sanitize(userPage.inbox),
        sanitize(userPage.outbox),
        sanitize(userPage.name ?? user),
        sanitize(userPage.summary),
        (userPage.icon ?? {}).url
    ]
    
    if(userPage.publicKey.id == `${userLink}#main-key` || userPage.publicKey.id == `${userLink}/#main-key`) {
        returnStatement.publickeypem = userPage.publicKey.publicKeyPem
    }
    
    //only add the user to the database if it has a public key
    if(returnStatement.publickeypem) {
        try {
            await query("DELETE FROM remoteusers WHERE handle=$1;", [user])
        }
        catch(err) {
        }
        
        await query("INSERT INTO RemoteUsers (handle, username, bio, link, inbox, outbox, profilePicture, publicKeyPem, lastfetch) Values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [returnStatement.handle, returnStatement.username, returnStatement.bio, returnStatement.link, returnStatement.inbox, returnStatement.outbox, returnStatement.profilepicture, returnStatement.publickeypem, returnStatement.lastfetch])
    }
    
    
    return {"message": returnStatement, "status": 200}
}

exports.getUserAsAdmin = getUserAsAdmin