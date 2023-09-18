const express = require("express")
const bodyParser = require("body-parser")
const query = require("./../../javascript/db")
const forge = require('node-forge');

const router = express.Router()
const jsonMiddleware = bodyParser.json({ type: 'application/json' });
router.use(jsonMiddleware)


router.post("/", async (req, res) => {
    try {
        let body = req.body
        let handle = body.handle
        let username = body.username
        let email = body.email
        let password = body.password
        if(handle && username && email && password) {
            if(handle.length > 20 || username.length > 30 || email.length > 100) {
                res.status(400)
            }
            else {
                if((await query("SELECT * FROM Users WHERE handle ~* $1;", [handle])).rowCount != 0) {
                    res.status(409).send({error: "handle already taken"})
                }
                else if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    res.status(409).send({error: "email already taken"})
                }
                else {
                    let hash = await Bun.password.hash(password);
                    query("INSERT INTO Users (handle, username, email, password, emailVerification) VALUES ($1, $2, $3, $4, $5);", [handle, username, email, hash, crypto.randomUUID()])
                    res.send("sucess")
                }
            }
        }
        else {
            res.status(400)
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
    const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

    // Output the keys
    return { "privateKeyPem": privateKeyPem, "publicKeyPem": publicKeyPem }
}

module.exports = router
