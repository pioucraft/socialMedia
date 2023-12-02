const query = require("../../javascript/db")
const sanitize = require("sanitize-html")

async function changeUsername(body) {
    try {
        let handle = body.handle
        let username = sanitize(body.username)
        if(username.length > 20) {
            return {"message": "400 Bad Request", "status": 400}
        }
        await query("UPDATE Users SET username = $1 WHERE handle = $2", [username, handle])
        return {"message": "Success", "status": 200}
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = changeUsername
