const query = require("../../javascript/db")


async function login(body) {
    let email = body.email
    let password = body.password
    let truePassword = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].password
    if(await Bun.password.verify(password, truePassword)) {
        let token = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].token
        let handle = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].handle
        let response = {"token": token, "handle": handle}
        return {"message": response, "status": 200}
    }
    else {
        return {"message": "401 Unauthorized", "status": 401}
    }
 
}




module.exports = login
