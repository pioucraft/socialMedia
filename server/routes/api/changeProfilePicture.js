const query = require("../../javascript/db")
const sanitize = require("sanitize-html")

async function changeProfilePicture(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let profilePicture = sanitize(body.profilePicture)
        let token = body.token
        if(!profilePicture.endsWith(".jpg") && !profilePicture.endsWith(".jpeg") && !profilePicture.endsWith(".png") && !profilePicture.endsWith(".gif") && !profilePicture.endsWith(".webp")) {
            return {"message": "400 Bad Request", "status": 400}
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                    return {"message": "401 Please Verify Your Email", "status": 401}
                }
                else {
                    await query("UPDATE Users SET profilePicture = $1 WHERE handle = $2", [profilePicture, handle])
                    return {"message": "Success", "status": 200}
                }

            }
            else {
                return {"message": "401 Unauthorized", "status": 401}
            }
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}




module.exports = changeProfilePicture
