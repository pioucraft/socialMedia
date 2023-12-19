const query = require("../../javascript/db")

async function getFollowingUsersPosts(body) {
    let handle = body.handle
    let following = (await query("SELECT * FROM users WHERE handle = $1", [handle])).rows[0].following
    console.log(following)
    return {"message": post, "status": 200}
}
module.exports = getFollowingUsersPosts