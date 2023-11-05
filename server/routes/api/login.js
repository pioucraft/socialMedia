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
            res.send({"token": token})
        }
        else {
            res.sendStatus(401)
        }
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
}




module.exports = login
