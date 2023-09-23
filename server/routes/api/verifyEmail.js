const express = require("express")
const query = require("./../../javascript/db")
const forge = require('node-forge');

const router = express.Router()

router.get("/:uuid", async (req, res) => {
    try {
        let uuid = req.params.uuid
        
        if(uuid == "yes") {
            res.sendStatus(404)
        }
        else {
            if((await query("SELECT * FROM Users WHERE emailVerification = $1", [uuid])).rows[0].publickeypem == null) {
                let keys = await generateKeyPair()
                console.log(keys)
                await query("UPDATE Users SET publicKeyPem = $1 WHERE emailVerification = $2", [keys.publicKeyPem, uuid])
                await query("UPDATE Users SET privateKeyPem = $1 WHERE emailVerification = $2", [keys.privateKeyPem, uuid])
            }
            await query("UPDATE Users SET emailVerification = 'yes' WHERE emailVerification = $1;", [uuid])
            res.sendStatus(200)
        }   
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
})

async function generateKeyPair() {
    // Create an RSA key pair
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

    // Get the private and public keys in PEM format
    const privateKeyPem = await forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKeyPem = await forge.pki.publicKeyToPem(keyPair.publicKey);

    // Output the keys
    return { "privateKeyPem": privateKeyPem.replaceAll("\r+", ""), "publicKeyPem": publicKeyPem.replaceAll("\r+", "") }
}

module.exports = router