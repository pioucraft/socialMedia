const query = require("./db")
const crypto = require("node:crypto")

async function verifySignature(req) {
    let body = await req.json()
    console.log(body)
    
    const hash = crypto.createHash('sha256');
    hash.update(body.toString(), 'utf-8');
    const digest = hash.digest('base64');
    console.log(digest)
    console.log(req.headers.get("digest"))
}

module.exports = {"verifySignature": verifySignature}