const query = require("../../javascript/db")
const sanitize = require("sanitize-html")

async function changeBio(req, body) {
    try {
        let body = await req.json()
        let handle = body.handle
        let bio = sanitize(body.bio)
        if(bio.length > 1000) {
            return {"message": "400 Bad Request", "status": 400}
        }
        if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
            return {"message": "401 Please Verify Your Email", "status": 401}
        }
        await query("UPDATE Users SET bio = $1 WHERE handle = $2", [bio, handle])
        return {"message": "Success", "status": 200}
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}




module.exports = changeBio
