const query = require("../../javascript/db")

async function handle(req) {
    try {
        let handle = req.url.split("/")[4]
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(handleFromDatabse) {
            let response = {
                "@context": [
                    "https://www.w3.org/ns/activitystreams",
                    "https://w3id.org/security/v1"
                ],
                "id": `${process.env.URL}/users/${handle}`,
                "type": "Person",
                "preferredUsername": handle,
                "name": handleFromDatabse.username,
                //"summary": handleFromDatabse.bio,
                //"icon": {
                //    "type": "Image",
                //    "mediaType": `image/${handleFromDatabse.profilepicture.split(".")[handleFromDatabse.profilepicture.split(".").length - 1]}`,
                //    "url": `${process.env.URL}/images/${handleFromDatabse.profilepicture}`,
                //},
                "inbox": `${process.env.URL}/users/${handle}/inbox`,
                "publicKey": {
                    "id": `${process.env.URL}/users/${handle}#main-key`,
                    "owner": `${process.env.URL}/users/${handle}`,
                    "publicKeyPem": handleFromDatabse.publickeypem
                }
            }
            if(handleFromDatabse.profilepicture)  {
                response.icon = {
                    "type": "Image",
                    "mediaType": `image/${handleFromDatabse.profilepicture.split(".")[handleFromDatabse.profilepicture.split(".").length - 1]}`,
                    "url": `${process.env.URL}/files/${handle}/${handleFromDatabse.profilepicture}`,
                }
            }
            if(handleFromDatabse.bio) {
                response.summary = handleFromDatabse.bio
            }
            return JSON.stringify(response)
        }
        else {
            return {"message": "404 Not Found", "code": 404}
        }
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "code": 500}
    }
}

module.exports = handle