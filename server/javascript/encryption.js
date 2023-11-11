const query = require("./db")
const crypto = require("node:crypto")

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
            headers[i] = headers[i].join("/");
        } else if (headers[i] === "host") {
            headers[i] = userLink.split("/")[2];
        } else if (headers[i] === "date") {
            headers[i] = date.getTime();
        } else if (headers[i] === "accept") {
            headers[i] = "application/activity+json, application/ld+json";
        }
    }
    console.log(headers)

    let actorFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [actor])).rows[0]
    let privateKeyPem = actorFromDb.privatekeypem
    let key = crypto.createPrivateKey(privateKeyPem)
    headers = headers.join("\n")
    let signature = crypto.sign("sha256", Buffer.from(headers), key).toString("base64");
    console.log(`keyId=${process.env.URL}/users/${actor}#main-key",algorithm="rsa-sha256",headers="${rawHeaders}",signature="${signature}"`)
    return `keyId=${process.env.URL}/users/${actor}#main-key",algorithm="rsa-sha256",headers="${rawHeaders}",signature="${signature}"`
}

module.exports = {"signWithoutBody": signWithoutBody}