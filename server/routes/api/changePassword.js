const query = require("../../javascript/db")

async function changePassword(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let password = body.password
        let oldtoken = body.token
        if(handle.length > 20) {
            res.sendStatus(400)
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == oldtoken) {
                if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                    res.status(401).send({"message": "please verify your email"})
                }
                else {
                    let hash = await Bun.password.hash(password)
                    let newToken = token()
                    await query("UPDATE Users SET password = $1 WHERE handle = $2", [hash, handle])
                    await query("UPDATE Users SET token = $1 WHERE handle = $2", [newToken, handle])
                    res.send({"token": newToken})
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

var rand = function() {
    return Math.random().toString(36)
};

var token = function() {
    return rand() + rand() + rand() + rand() + rand() + rand(); 
};

module.exports = changePassword
