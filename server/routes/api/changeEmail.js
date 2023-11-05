const query = require("../../javascript/db")

async function changeEmail(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let email = body.email
        let token = body.token
        if(email.length > 100) {
            res.sendStatus(400)
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    res.status(409).send({error: "email already taken"})
                }
                else {
                    await query("UPDATE Users SET email = $1 WHERE handle = $2", [email, handle])
                    await query("UPDATE Users Set emailVerification = $1 WHERE HANDLE = $2", [crypto.randomUUID(), handle])
                    res.sendStatus(200)
                }
                
            }
            else {
                res.sendStatus(401)
            }
        }
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
}




module.exports = changeEmail
