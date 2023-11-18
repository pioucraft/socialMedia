const query = require("../../javascript/db")
const getUserJs = require("../../javascript/getuser")

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
                if(user.includes(process.env.DOMAIN)) {
                    return {"message": "218 IDK", "status": 218}
                }
                else {
                    return await getUserJs(user)
                }
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



module.exports = getUser
