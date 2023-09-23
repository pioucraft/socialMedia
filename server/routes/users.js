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
                "name": (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].username,
                "summary": (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].bio,
                "icon": [
                    `https://${process.env.URL}/images/${(await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].profilePicture}`
                ],
                "inbox": `https://${process.env.URL}/users/${handle}/inbox`,
                "publicKey": {
                    "id": `https://${process.env.URL}/users/${handle}#main-key`,
                    "owner": `https://${process.env.URL}/users/${handle}`,
                    "publicKeyPem": (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].publickeypem
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