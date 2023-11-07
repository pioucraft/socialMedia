const query = require("./../../javascript/db")
const forge = require('node-forge');


async function verifyEmail(req) {
    try {
        let uuid = req.url.split("/")[5]
        
        if(uuid == "yes") {
            return {"message": "404 Not Found", "code": 404}
        }
        else {
            if((await query("SELECT * FROM Users WHERE emailVerification = $1", [uuid])).rows[0].publickeypem == null) {
                let keys = await generateKeyPair()
                console.log(keys)
                await query("UPDATE Users SET publicKeyPem = $1 WHERE emailVerification = $2", [keys.publicKeyPem, uuid])
                await query("UPDATE Users SET privateKeyPem = $1 WHERE emailVerification = $2", [keys.privateKeyPem, uuid])
            }
            await query("UPDATE Users SET emailVerification = 'yes' WHERE emailVerification = $1;", [uuid])
            return {"message": "Success, you can now use your account", "code": 200}
        }   
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "code": 500}
    }
}

async function generateKeyPair() {
    // Create an RSA key pair
    const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

    // Get the private and public keys in PEM format
    const privateKeyPem = await forge.pki.privateKeyToPem(keyPair.privateKey);
    const publicKeyPem = await forge.pki.publicKeyToPem(keyPair.publicKey);

    // Output the keys
    return { "privateKeyPem": privateKeyPem.replaceAll("\r", "").slice(0, -2), "publicKeyPem": publicKeyPem.replaceAll("\r", "").slice(0, -2) }
}

module.exports = verifyEmail