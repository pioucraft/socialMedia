const query = require("./db")

async function signWithoutBody(actor, headers) {
    let actorFromDb = (await query("SELECT * FROM Users WHERE handle = $1", [actor])).rows[0]
    let privateKeyPem = actorFromDb.privatekeypem
}

module.exports = {"signWithoutBody": signWithoutBody}