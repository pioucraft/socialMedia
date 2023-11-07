const query = require("../../javascript/db")

async function changeUsername(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let username = body.username
        let token = body.token
        if(username.length > 20) {
            return {"message": "400 Bad Request", "code": 400}
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                    return {"message": "401 Please Verify Your Email", "code": 401}
                }
                else {
                    await query("UPDATE Users SET username = $1 WHERE handle = $2", [username, handle])
                    return "Success"
                }

            }
            else {
                return {"message": "401 Unauthorized", "code": 401}
            }
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "code": 500}
    }
}

module.exports = changeUsername
