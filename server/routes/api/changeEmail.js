const query = require("../../javascript/db")

async function changeEmail(body) {
    let handle = body.handle
    let email = body.email
    if(email.length > 100) {
        return {"message": "400 Email Too Long", "status": 400}
    }
    if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
        return {"message": "409 Email Already Taken", "status": 409}
    }
    await query("UPDATE Users SET email = $1 WHERE handle = $2", [email, handle])
    await query("UPDATE Users Set emailVerification = $1 WHERE HANDLE = $2", [crypto.randomUUID(), handle])
    return {"message": "Success", "status": 200}       
}




module.exports = changeEmail
