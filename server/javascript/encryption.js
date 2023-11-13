const query = require("./db")
const crypto = require("node:crypto")

async function verifySignature(req) {
    let body = await req.json()
    console.log(body)
    
    const hash = crypto.createHash('SHA-256');
    hash.update(JSON.stringify(body), 'utf-8');
    const digest = hash.digest('base64');
    if(digest == req.headers.get("digest").split("SHA-256")[1]) {
        console.log("true")
    }
    else {
        return false
    }
    console.log(digest)
    console.log()
}

module.exports = {"verifySignature": verifySignature}