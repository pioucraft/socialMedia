const query = require("./db");
const getUserJs = require("./getuser")
const crypto = require("node:crypto")

async function verifySignature(req, bodyAsString) {
    let body = JSON.parse(bodyAsString)

    //create the digest
    const hash = crypto.createHash('sha256');
    let digest = hash.update(bodyAsString, "utf-8")
        .digest()
        .toString("base64")

    //Create the dates for verification
    let now = new Date()
    let date = new Date(req.headers.get("date"))

    //verify the date and the digest
    let signatureCreationTimeIsGood = now.getTime() < date.getTime() + 30_000
    let digestsMatch = digest == req.headers.get("digest").split("SHA-256=")[1]

    if(digestsMatch && signatureCreationTimeIsGood) {
        //initialize some variables for later
        let signatureHeader = req.headers.get("signature").split(",")
        let headersList = ""
        let algorithm = ""
        let signature = ""

        //asign value to the variables
        for(let i=0;i<signatureHeader.length;i++) {
            if(signatureHeader[i].startsWith("headers")) {
                //set the list of headers
                headersList = signatureHeader[i].split('"')[1].split('"')[0]
            }
            else if(signatureHeader[i].startsWith("algorithm")) {
                //set the algorithm
                algorithm = signatureHeader[i].split('"')[1].split('"')[0]
            }
            else if(signatureHeader[i].startsWith("signature")) {
                //set the signature
                signature = signatureHeader[3].split('"')[1].split('"')[0]
            }
        }

        // now assign the correct values to the headers
        let headers = []
        let splitedHeaders = headersList.split(" ")
        for(let i=0;i<headersList.split(" ").length;i++) {
            
            if(splitedHeaders[i] == "(request-target)") {
                headers.push(`(request-target): post ${req.url.split(`http://localhost:${process.env.PORT}`)[1]}`)
            }
            else if(splitedHeaders[i] == "host") {
                headers.push(`host: ${process.env.DOMAIN}`)
            }
            else {
                headers.push(`${splitedHeaders[i]}: ${req.headers.get(splitedHeaders[i])}`)
            }
            
        }
        headers = headers.join("\n")

        //verify the headers provided by remote include the necessary headers
        if(!headers.includes("date: ") || !headers.includes("digest: ") || !headers.includes("(request-target): " || !headers.includes("host: "))) {
            return false
        }

        //get the user and then create the public key
        let userFetched = await (await fetch(body.actor, {headers: {"Accept": "application/activity+json, applictaion/ld+json"}})).json()
        let actor = (`${userFetched.preferredUsername}@${body.actor.split("/")[2]}`)
        let publicKeyPem = (await getUserJs.getUserAsAdmin(actor)).message.publickeypem
        let publicKey = crypto.createPublicKey(publicKeyPem)
        
        //verify the signature
        let verification = crypto.verify(algorithm, Buffer.from(headers), publicKey, Buffer.from(signature, "base64"))
        return verification
        
    }
    else {
        return false
    }
}

async function sign(body, headers) {
    //fetch the user and its private key     
    let actor = (await query("SELECT * FROM Users WHERE handle = $1", [body.actor.split("/")[4]])).rows[0]
    let privateKeyPem = actor.privatekeypem
    const privateKey = crypto.createPrivateKey(privateKeyPem)
    
    //sign the body and return the signature with other required infos for the header
    let signature = crypto.sign("rsa-sha256", Buffer.from(headers), privateKey).toString("base64")
    let returnStatement = `keyId="${body.actor}#main-key",algorithm="rsa-sha256",headers="(request-target) digest host date",signature="${signature}"`
    return returnStatement
}


exports.verifySignature = verifySignature
exports.sign = sign