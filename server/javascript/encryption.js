const query = require("./db");
const getUserJs = require("./getuser")
const crypto = require("node:crypto")
const hashJs = require("hash.js")

async function signWithoutBody(actor, rawHeaders, userLink, date) {
    let headers = rawHeaders.split(" ")
    console.log(headers)
    for (let i = 0; i < headers.length; i++) {
        if (headers[i] === "(request-target)") {
            headers[i] = userLink.split(`/`);
            console.log(headers[i])
            headers[i].shift();
            headers[i].shift();
            headers[i].shift();
            headers[i] = "(request-target): "+"/" + headers[i].join("/");
        } else if (headers[i] === "host") {
            headers[i] = "host: "+userLink.split("/")[2];
        } else if (headers[i] === "date") {
            headers[i] = "date: "+date.getTime();
        } else if (headers[i] === "accept") {
            headers[i] = "accept: "+"application/activity+json, application/ld+json";
        }
    }
    headers = headers.join("\n")
    console.log(headers)
    let actorFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [actor])).rows[0]
    let privateKeyPem = actorFromDb.privatekeypem
    console.log(privateKeyPem)
    let key = crypto.createPrivateKey(privateKeyPem)

    let signature = crypto.sign("sha256", Buffer.from(headers), key).toString("base64");
    console.log(`keyId=${process.env.URL}/users/${actor}#main-key",algorithm="rsa-sha256",headers="${rawHeaders}",signature="${signature}"`)
    return `keyId=${process.env.URL}/users/${actor}#main-key",algorithm="rsa-sha256",headers="${rawHeaders}",signature="${signature}"`
}

async function verifySignature(req, bodyAsString) {
    let body = JSON.parse(bodyAsString)
    const hash = crypto.createHash('sha256');
    const encoder = new TextEncoder();
    let digest = hash.update(bodyAsString, "utf-8").digest().toString("base64")
    console.log(bodyAsString)
    console.log(digest)
    console.log("|||||")
    console.log(req.headers.get("digest").split("SHA-256=")[1])
    let now = new Date()
    let date = new Date(req.headers.get("date"))
    if(digest == req.headers.get("digest").split("SHA-256=")[1] && now.getTime() < date.getTime() + 30_000) {
        console.log("true")
        let signatureHeader = req.headers.get("signature").split(",")
        let headersList = ""
        let algorithm = ""
        let signature = ""
        for(let i=0;i<signatureHeader.length;i++) {
            if(signatureHeader[i].startsWith("headers")) {
                headersList = signatureHeader[i].split('"')[1].split('"')
            }
            else if(signatureHeader[i].startsWith("algorithm")) {
                algorithm = signatureHeader[i].split('"')[1].split('"')[0]
            }
            else if(signatureHeader[i].startsWith("signature")) {
                signature = signatureHeader[3].split('"')[1].split('"')[0]
            }
        }
        [0]
        console.log(headersList)
        
        
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
            else {
                console.log(`${splitedHeaders[i]}: ${req.headers.get(splitedHeaders[i])}`)
                headers.push(`${splitedHeaders[i]}: ${req.headers.get(splitedHeaders[i])}`)
            }
            
        }
        headers = headers.join("\n")
        if(!headers.includes("date:") || !headers.includes("digest:") || !headers.includes("(request-target):" || !headers.includes("host:"))) {
            return false
        }
        console.log(headers)
        let userFetched = await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json()
        let actor = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
        console.log(getUserJs)
        let publicKeyPem = (await getUserJs.getUserAsAdmin(actor)).message.publickeypem
        console.log("finished")
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

async function sign(body, headers) {

    
    console.log(body)
    let actor = (await query("SELECT * FROM Users WHERE handle = $1", [body.actor.split("/")[4]])).rows[0]
    let privateKey = actor.privatekeypem
    console.log(privateKey)
    
    const key = crypto.createPrivateKey(privateKey)
    let signature = crypto.sign("rsa-sha256", Buffer.from(headers), key).toString("base64")
    console.log(signature)
    let returnStatement = `keyId="${body.actor}#main-key",algorithm="rsa-sha256",headers="(request-target) digest host date",signature="${signature}"`
    console.log(returnStatement)
    return returnStatement
}


exports.verifySignature = verifySignature
exports.sign = sign
exports.signWithoutBody = signWithoutBody