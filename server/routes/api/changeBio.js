const query = require("../../javascript/db")


async function changeBio(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let bio = body.bio
        let token = body.token
        if(bio.length > 1000) {
            return {"message": "400 Bad Request", "code": 400}
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                    return {"message": "401 Please Verify Your Email", "code": 401}
                }
                else {
                    await query("UPDATE Users SET bio = $1 WHERE handle = $2", [bio, handle])
                    return {"message": "200 Sucess", "code": 200}
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




module.exports = changeBio
