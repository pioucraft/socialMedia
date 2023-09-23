const express = require("express")
const query = require("../javascript/db")

const router = express.Router()

router.get("/:handle", async (req, res) => {
    try {
        console.log("request")
        let handle = req.params.handle
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(handleFromDatabse) {
            let response = {
                "@context": [
                    "https://www.w3.org/ns/activitystreams",
                    "https://w3id.org/security/v1"
                ],
                "id": `https://${process.env.URL}/users/${handle}`,
                "type": "Person",
                "preferredUsername": handle,
                "name": handleFromDatabse.username,
                "summary": handleFromDatabse.bio,
                "icon": {
                    "type": "Image",
                    "mediaType": `image/${handleFromDatabse.profilepicture.split(".")[handleFromDatabse.profilepicture.length - 1]}`,
                    "url": `https://${process.env.URL}/images/${handleFromDatabse.profilepicture}`,
                },
                "inbox": `https://${process.env.URL}/users/${handle}/inbox`,
                "publicKey": {
                    "id": `https://${process.env.URL}/users/${handle}#main-key`,
                    "owner": `https://${process.env.URL}/users/${handle}`,
                    "publicKeyPem": handleFromDatabse.publickeypem
                }
            }
            res.send(response)
        }
        else {
            res.sendStatus(404)
        }
    }
    catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router