const query = require("../../javascript/db")
const sanitize = require("sanitize-html")
const encryption = require("../../javascript/encryption")
const activitystreams = require("../../javascript/activitystreams")

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
            let userFromDatabase = (await query("SELECT * FROM remoteUsers WHERE handle = $1", [user])).rows[0]
            if(userFromDatabase /*&& hasbeenlastfetchsincelessthan1day*/) {
                return userFromDatabase
            }
            else {
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

    // SANITIZE HTML !!!!
    
    
    /*
    
        fetch with signature. I will need to generate a main key that will be used for the server.
        here's an example of a request :

        request !!!
        Request (0 KB) {
        method: "GET",
        url: "http://localhost:3000/users/pioucraft",
        headers: Headers {
            "host": "localhost:3000",
            "user-agent": "http.rb/5.1.1 (Mastodon/4.2.1; +https://caluettefamily.com/)",
            "date": "Sat, 11 Nov 2023 12:52:00 GMT",
            "accept-encoding": "gzip",
            "accept": "application/activity+json, application/ld+json",
            "connection": "Keep-Alive",
            "signature": "keyId=\"https://caluettefamily.com/actor#main-key\",algorithm=\"rsa-sha256\",headers=\"(request-target) host date accept\",signature=\"1NUczlhxS2HepfXN70E1nsrY/uYETTuYyj3+0r9eSC1F8XtbiRfnRiXbdmkeHf6XYplmBlIfgdFZqp5K7iAv7zitiB5Iwu91vZ11ha2j4IoZYG8SSKkDIczXbKxsH0fW47PNmWDHWtwfX1L0F5JV2HJzmfQygFWkav5gFfD0nKLLTDqffiW9fmaUrrc7tsElo5Y55XHYuU/bHza9r+Hla4rQqpp2QjWjX30SFQJoMNAuZmof4X2Jb3ibSroiWQWSyVrkmNgfwkKGKvtmnWc0eNzN7E6+UtMENR+Xm2v9eAWclvAlJksi0ynQiFhrUqBFknq9eMIwTrWAw+iCYu39BA==\"",
            "x-forwarded-for": "74.194.226.131",
            "x-forwarded-host": "test.gougoule.ch",
            "x-forwarded-server": "test.gougoule.ch"
        }
        }


        ------------------

        make a function to sign anything and another to verify the signature of anything. put all of them in the file

    */


    //finish the fetching with the signature
    //add the fetched data to the database and return it
    //read documentation for the activitystreams collections
    //then use the getUserAsAdmin function with the file inbox.js. It will be used when someone follows an account on this server
    //when following an account on the same server, don't use activitypub. It's stupid, just use local api or something
    //when someone tries to follow on the same server. check the domains and prevent the person from doing it using activitypub. When you follow on the same server, you don't have to specify a domain name
    let date = new Date()
    let signature = await encryption.signWithoutBody("admin", "(request-target) host date accept", userLink, date)
    let userPage = await (await fetch(userLink, {headers: {"Accept": "application/activity+json", "Signature": signature}})).json()
    let returnStatement = {}
    returnStatement.handle = sanitize(user)
    returnStatement.username = sanitize(userPage.preferedUsername)
    returnStatement.bio = sanitize(userPage.summary)
    returnStatement.link = sanitize(userPage.link)
    returnStatement.inbox = sanitize(userPage.inbox)
    returnStatement.outbox = sanitize(userPage.outbox)


    
    returnStatement.lastfetch = date.getTime()
    return {"message": userPage, "status": 200}
}

module.exports = {"getUser": getUser, "getUserAsAdmin": getUserAsAdmin}
