const query = require("../../javascript/db")

async function changePassword(req) {
    try {
        let body = await req.json()
        let handle = body.handle
        let newPassword = body.newPassword
        let oldPassword = body.oldPassword
        let oldtoken = body.token
        if(handle.length > 20) {
            return {"message": "400 Bad Request", "code": 400}
        }
        else {
            let thingThatIQuery = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
            let trueToken = thingThatIQuery.token
            let truePassword = thingThatIQuery.password
            console.log(await Bun.password.verify(oldPassword, truePassword))
            console.log(trueToken)
            console.log(oldtoken)
            if(trueToken == oldtoken && (await Bun.password.verify(oldPassword, truePassword))) {
                console.log("verified")
                if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                    return {"message": "401 Please Verify Your Email", "code": 401}
                }
                else {
                    let hash = await Bun.password.hash(newPassword)
                    let newToken = token()
                    await query("UPDATE Users SET password = $1 WHERE handle = $2", [hash, handle])
                    await query("UPDATE Users SET token = $1 WHERE handle = $2", [newToken, handle])
                    return JSON.stringify({"token": newToken})
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

var rand = function() {
    return Math.random().toString(36)
};

var token = function() {
    return rand() + rand() + rand() + rand() + rand() + rand(); 
};

module.exports = changePassword
