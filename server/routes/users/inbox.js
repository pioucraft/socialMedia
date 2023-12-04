const query = require("../../javascript/db");
const encryption = require("../../javascript/encryption")

const undoFollow = require("./inbox/undoFollow")
const follow = require("./inbox/follow")
const acceptFollow = require("./inbox/acceptFollow")
const createNote = require("./inbox/createNote")

async function inbox(req) {
    try {
        let bodyString = (await Bun.readableStreamToText(req.body))
        let body = JSON.parse(bodyString)
        console.log(body)
        let handle = req.url.split("/")[4]
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(!handleFromDatabse) {
            return {"message": "404 Not Found", "status": 404}
        }
        if(!(await encryption.verifySignature(req, bodyString))) {
            return {"message": "400 Bad Request", "status": 400}
        }
        else {
            if(body.type == "Undo") {
                if(body.object.type == "Follow") {
                    return await undoFollow(body, handle)
                }
            }
            else if(body.type == "Follow") {
                return await follow(body, handle)
            }
            else if(body.type == "Accept") {
                if(body.object.type == "Follow") {
                    return await acceptFollow(body, handle, handleFromDatabse)
                }
            }
            else if(body.type == "Create") {
                if(body.object.type == "Note") {
                    return await createNote(body, handleFromDatabse)
                }
            }
        }
        
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
    
    
}


module.exports = inbox