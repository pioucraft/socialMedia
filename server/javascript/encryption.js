const query = require("./db")

async function signWithoutBody(actor, headers, userLink, date) {
    headers = headers.split(" ")
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
}

module.exports = {"signWithoutBody": signWithoutBody}