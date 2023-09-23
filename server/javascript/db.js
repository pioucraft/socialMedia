const pg = require("pg")

const client = new pg.Client({database: "socialmedia", user: "postgres", password: process.env.psql_password})
client.connect().then(() => console.log("connected to the database"))

try {
    query("CREATE TABLE Users(handle VARCHAR(20), username VARCHAR(30), email VARCHAR(100), password TEXT, bio VARCHAR(1000), following TEXT, followers TEXT, profilePicture VARCHAR(45), notes TEXT, announces TEXT, likes TEXT, publicKeyPem TEXT, privateKeyPem TEXT, emailVerification TEXT, token TEXT, lastVerificationEmailSent BIGSERIAL);")
}
catch(err) {
    console.log(err)
    console.log("There's probably no error, it probably means that the tables already exist in the database.")
}

async function query(query, parameters) {
    let res
    if(parameters) {
        res = await client.query(query, parameters)
    }
    else {
        res = await client.query(query)
    }
    return res
}

module.exports = query