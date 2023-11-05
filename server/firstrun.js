import 'dotenv/config'
const query = require("./javascript/db.js")

try {
    query("CREATE TABLE Users(handle VARCHAR(20), username VARCHAR(30), email VARCHAR(100), password TEXT, bio VARCHAR(1000), following TEXT, followers TEXT, profilePicture VARCHAR(45), notes TEXT, announces TEXT, likes TEXT, publicKeyPem TEXT, privateKeyPem TEXT, emailVerification TEXT, token TEXT, lastVerificationEmailSent BIGSERIAL);").then(() => {
        console.log("1️⃣  - The database was succesfuly initialized")
        let toLog = "\n\n🚀 If you followed all the instructions in the documentation, you can safely run 'bun run start' to launch the social media"
        console.log(toLog)
    })
    
}
catch(err) {
    console.log(err)
}


