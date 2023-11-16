const query = require("./db");
const getUserJs = require("./getuser")
const crypto = require("node:crypto")

async function verifySignature(req, body) {
    
    const hash = crypto.createHash('SHA-256');
    hash.update(JSON.stringify(body), 'utf-8');
    const digest = hash.digest('base64');
    console.log(digest)
    console.log(req.headers.get("digest").split("SHA-256=")[1])
    let now = new Date()
    let date = new Date(req.headers.get("date"))
    if(digest == req.headers.get("digest").split("SHA-256=")[1] && now.getTime() < date.getTime() + 30_000) {
        console.log("true")
        let signatureHeader = req.headers.get("signature").split(",")
        let headersList = signatureHeader[2].split('"')[1].split('"')[0]
        console.log(headersList)
        let algorithm = signatureHeader[1].split('"')[1].split('"')[0]
        let signature = signatureHeader[3].split('"')[1].split('"')[0]
        console.log(signature)
        let headers = []
        let splitedHeaders = headersList.split(" ")
        for(let i = 0; i<headersList.split(" ").length;i++) {
            
            if(splitedHeaders[i] == "(request-target)") {
                headers.push(`(request-target): post ${req.url.split(`http://localhost:${process.env.PORT}`)[1]}`)
            }
            else if(splitedHeaders[i] == "host") {
                headers.push(`host: ${process.env.DOMAIN}`)
            }
            else if(splitedHeaders[i] == "date") {
                headers.push(`date: ${req.headers.get("date")}`)
            }
            else if(splitedHeaders[i] == "digest") {
                headers.push(`digest: ${req.headers.get("digest")}`)
            }
            else if(splitedHeaders[i] == "content-type") {
                headers.push(`content-type: ${req.headers.get("content-type")}`)
            }
            
        }
        headers = headers.join("\n")
        if(!headers.includes("date:") || !headers.includes("digest:") || !headers.includes("(request-target):" || !headers.includes("host:"))) {
            return false
        }
        console.log(headers)
        let userFetched = await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json()
        let actor = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
        
        let publicKeyPem = (await getUserJs.getUserAsAdmin(actor)).message.publickeypem
        console.log("finished")
        //verify the date thing with 30 seconds or idk what
        //verify that a minimum of headers are included in the signature
        let publicKey = crypto.createPublicKey(publicKeyPem)
        console.log("algorithm: "+algorithm)
        console.log("headers: "+headers)
        console.log("publicKey: "+publicKey)
        console.log("signature:"+signature)
        
        let verification = crypto.verify(algorithm, Buffer.from(headers), publicKey, Buffer.from(signature, "base64"))
        console.log(verification)
        return verification
        
    }
    else {
        return false
    }
}

async function sign(body) {
    let date = new Date().toUTCString()
    let activityId = `${URL}/${crypto.randomUUID()}`
    body = JSON.stringify(body)

    const hash = crypto.createHash('sha256');
    hash.update(body, 'utf-8');
    const digest = hash.digest('base64');
    let privateKey = (await query("SELECT * FROM Users WHERE handle = $1", [body.actor.split("/")[4]])).rows[0].privatekeypem
    console.log(privateKey)
    const key = crypto.createPrivateKey(privateKey)

}

module.exports = {"verifySignature": verifySignature, "sign": sign}