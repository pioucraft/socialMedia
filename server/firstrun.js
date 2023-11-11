import 'dotenv/config'
const query = require("./javascript/db.js")

try {
    query("CREATE TABLE Users(handle VARCHAR(20), username VARCHAR(30), email VARCHAR(100), password TEXT, bio VARCHAR(1000), following TEXT, followers TEXT, profilePicture VARCHAR(100), notes TEXT, announces TEXT, likes TEXT, publicKeyPem TEXT, privateKeyPem TEXT, emailVerification TEXT, token TEXT, lastVerificationEmailSent BIGSERIAL);")
}
catch(err) {
    console.log(err)
}
try {
    query("CREATE TABLE RemoteUsers(handle VARCHAR(50), username VARCHAR(100), bio TEXT, following TEXT, followers TEXT, profilePicture VARCHAR(300), notes TEXT, announces TEXT, likes TEXT, publicKeyPem TEXT, lastFetch BIGSERIAL, link VARCHAR(300), inbox VARCHAR(300), outbox VARCHAR(300));")
}
catch(err) {
    console.log(err)
}

console.log("1️⃣  - The database was succesfuly initialized")
let toLog = "\n\n🚀 If you followed all the instructions in the documentation, you can safely run 'bun run start' to launch the social media"
console.log(toLog)
