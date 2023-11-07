const query = require("../../javascript/db")


async function login(req) {
    try {
        let body = await req.json()
        let email = body.email
        let password = body.password
        let truePassword = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].password
        if(await Bun.password.verify(password, truePassword)) {
            let token = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].token
            let handle = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].handle
            return JSON.stringify({"token": token, "handle": handle})
        }
        else {
            return {"message": "401 Unauthorized", "code": 401}
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "code": 500}
    }
}




module.exports = login
