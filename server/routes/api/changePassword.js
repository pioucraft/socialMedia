const query = require("../../javascript/db")

async function changePassword(body) {
    try {
        let handle = body.handle
        let newPassword = body.newPassword
        let oldPassword = body.oldPassword
        let thingThatIQuery = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
        let truePassword = thingThatIQuery.password
        if(!(await Bun.password.verify(oldPassword, truePassword))) {
            return {"message": "401 Unauthorized", "status": 401}
        }
        if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
            return {"message": "401 Please Verify Your Email", "status": 401}
        }
        let hash = await Bun.password.hash(newPassword)
        let newToken = token()
        await query("UPDATE Users SET password = $1 WHERE handle = $2", [hash, handle])
        await query("UPDATE Users SET token = $1 WHERE handle = $2", [newToken, handle])
        let response = {"token": newToken}
        return {"message": response, "status": 200}
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

var rand = function() {
    return Math.random().toString(36)
};

var token = function() {
    return rand() + rand() + rand() + rand() + rand() + rand(); 
};

module.exports = changePassword
