const getUserJs = require("./getuser")
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
        console.log(headers)
        let userFetched = await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json()
        let actor = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
        
        let publicKey = (await getUserJs.getUserAsAdmin(actor)).message.publickeypem
        console.log("finished")
        //verify the date thing with 30 seconds or idk what
        //verify that a minimum of headers are included in the signature
        console.log("algorithm: "+algorithm)
        console.log("headers: "+headers)
        console.log("publicKey: "+publicKey)
        console.log("signature:"+signature)
        let verification = crypto.verify("sha256", Buffer.from(headers), publicKey, signature)
        console.log(verification)
        
    }
    else {
        return false
    }
}

module.exports = {"verifySignature": verifySignature}