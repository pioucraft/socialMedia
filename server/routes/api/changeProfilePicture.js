const query = require("../../javascript/db")
const sanitize = require("sanitize-html")

async function changeProfilePicture(body) {
    try {
        let handle = body.handle
        let profilePicture = sanitize(body.profilePicture)
        if(!profilePicture.endsWith(".jpg") && !profilePicture.endsWith(".jpeg") && !profilePicture.endsWith(".png") && !profilePicture.endsWith(".gif") && !profilePicture.endsWith(".webp")) {
            return {"message": "400 Bad File Extension", "status": 400}
        }   
        await query("UPDATE Users SET profilePicture = $1 WHERE handle = $2", [profilePicture, handle])
        return {"message": "Success", "status": 200}
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}




module.exports = changeProfilePicture
