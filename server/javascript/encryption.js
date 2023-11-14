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
        let headersList = signatureHeader[2].split('"')[1].split('"')[0]
        console.log(headersList)
        let signature = signatureHeader[3].split('"')[1].split('"')[0]
        console.log(signature)
        let headers = []
        let splitedHeaders = headersList.split(" ")
        for(let i = 0; i<headersList.split(" ").length;i++) {
            
            if(splitedHeaders[i] == "(request-target)") {
                console.log("request target")
            }
            else if(splitedHeaders[i] == "host") {
                console.log("host")
            }
            else if(splitedHeaders[i] == "date") {
                console.log("date")
            }
            else if(splitedHeaders[i] == "digest") {
                console.log("digest")
            }
            else if(splitedHeaders[i] == "content-type") {
                console.log("content-type")
            }
        }
    }
    else {
        return false
    }
}

module.exports = {"verifySignature": verifySignature}