const query = require("./db")
const crypto = require("node:crypto")

async function verifySignature(req) {
    let body = await req.json()
    console.log(body)
    
    const hash = crypto.createHash('SHA-256');
    hash.update(JSON.stringify(body), 'utf-8');
    const digest = hash.digest('base64');
    console.log(digest)
    console.log(req.headers.get("digest").split("SHA-256=")[1])
    if(digest == req.headers.get("digest").split("SHA-256=")[1]) {
        console.log("true")
        let signatureHeader = req.headers.get("signature").split(",")
        let headers = signatureHeader[1].split('"')[1].split('"')[0]
        console.log(headers)
        let signature = signatureHeader[2].split('"')[1].split('"')[0]
        console.log(signature)
    }
    else {
        return false
    }
}

module.exports = {"verifySignature": verifySignature}