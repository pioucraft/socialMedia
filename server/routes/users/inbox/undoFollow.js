const query = require("../../../javascript/db");

async function undoFollow(body, handle) {
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

module.exports = undoFollow