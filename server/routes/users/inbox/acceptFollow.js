const query = require("../../../javascript/db");

async function acceptFollow(body, handle, userFromDatabase) {
    let userFollowing = JSON.parse(userFromDatabase.following)
    for(let i=0;i<userFollowing.length;i++) {
        if(userFollowing[i].id == body.object.id) {
            console.log(userFromDatabase)
            console.log("something")
            userFollowing[i].accepted = true
            console.log(userFollowing)
            await query("UPDATE Users SET following = $1 WHERE handle = $2", [JSON.stringify(userFollowing), handle])
            return {"message": "200 Success", "status": 200}
        }
    }
}

module.exports = acceptFollow