const getUserJs = require("../../../javascript/getuser")
const query = require("../../../javascript/db");
const sanitize = require("sanitize-html")

async function createNote(body, handleFromDatabse) {
    
    let userFetched = (await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json())
    let authorHandle = sanitize(`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
    
    let link = sanitize(body.object.id)
    let content = sanitize(body.object.content)

    let date = new Date()
    let postDate = date.getTime()

    //check if user is following the author
    let isFollowing = false
    for(let i=0;i<JSON.parse(handleFromDatabse.following).length;i++) {
        if(JSON.parse(handleFromDatabse.following)[i].user == authorHandle) {
            isFollowing = true
        } 
    }

    if(isFollowing == true) {

        (await query("INSERT INTO RemotePosts (author, content, link, date, likes, boosts) VALUES ($1, $2, $3, $4, 0, 0)", [authorHandle, content, link, postDate]))
        return {"message": "202 Accepted", "status": 202}
    }
    return {"message": "400 Not Followed By User", "status": 400}
}

module.exports = createNote