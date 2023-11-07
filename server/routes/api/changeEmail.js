const query = require("../../javascript/db")

async function changeEmail(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let email = body.email
        let token = body.token
        if(email.length > 100) {
            return {"message": "400 Bad Request", "code": 400}
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    return {"message": "409 Email Already Taken", "code": 409}
                }
                else {
                    await query("UPDATE Users SET email = $1 WHERE handle = $2", [email, handle])
                    await query("UPDATE Users Set emailVerification = $1 WHERE HANDLE = $2", [crypto.randomUUID(), handle])
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




module.exports = changeEmail
