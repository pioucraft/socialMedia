const getUserJs = require("../../../javascript/getuser")
const query = require("../../../javascript/db");
const sanitize = require("sanitize-html")

async function createNote(body, handleFromDatabse) {
    
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
    console.log(JSON.parse(handleFromDatabse.following))
    let isFollowing = false
    for(let i=0;i<JSON.parse(handleFromDatabse.following).length;i++) {
        if(JSON.parse(handleFromDatabse.following)[i].user == authorHandle) {
            isFollowing = true
        } 
    }
    if(isFollowing == true) {
        console.log(authorHandle)
        console.log(postDate)
        console.log(link)
        console.log(content)
        let response = (await query("INSERT INTO RemotePosts (author, content, link, date, likes, boosts) VALUES ($1, $2, $3, $4, 0, 0)", [authorHandle, content, link, postDate]))
        console.log(response)
        return {"message": "202 Accepted", "status": 202}
    }
    else {
        console.log("hyyyy")
        return {"message": "400 Bad Request", "status": 400}
    }
}

module.exports = createNote