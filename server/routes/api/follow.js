const query = require("../../javascript/db")
const getUserJs = require("../../javascript/getuser")


async function follow(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let token = body.token
        let user = body.user
        let userFromDatabase = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
        let trueToken = userFromDatabase.token
        if(trueToken == token) {
            if(userFromDatabase.emailverification != "yes") {
                return {"message": "401 Please Verify Your Email", "status": 401}
            }
            else {
                let userFollowing = JSON.parse(userFromDatabase.following)
                console.log(userFollowing)
                return {"message": "Success", "status": 200}
            }

        }
        else {
            return {"message": "401 Unauthorized", "status": 401}
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = follow