const query = require("../../javascript/db")

async function getFollowingUsersPosts(body) {
    let handle = body.handle
    let following = JSON.parse((await query("SELECT * FROM users WHERE handle = $1", [handle])).rows[0].following)
    
    let followingWithoutIds = []
    following.forEach(follow => followingWithoutIds.push(follow.user))
    console.log(followingWithoutIds)
    let posts = (await query("SELECT * FROM remoteposts WHERE author in ($1)", [followingWithoutIds.toString()])).rows[0].following
    return {"message": posts, "status": 200}
}
module.exports = getFollowingUsersPosts