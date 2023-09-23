const express = require("express")
const query = require("../javascript/db")

const router = express.Router()

router.get("/:handle", async (req, res) => {
    try {
        let handle = req.params.handle
        let handleFromDatabse = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
        if(handleFromDatabse) {
            let response = {
                "@context": "https://www.w3.org/ns/activitystreams",
                "type": "Person",
                "id": `https://${process.env.URL}/users/${handle}`,
                "preferedUsername": handle,
                "name": (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].username,
                "publicKey": {
                    "id": `https://${process.env.URL}/${handle}#main-key`,
                    "owner": `https://${process.env.URL}/${handle}`,
                    "publicKeyPem": (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].publickeypem
                }
            }
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