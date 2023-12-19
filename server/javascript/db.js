const pg = require("pg")

//connect to the database
const client = new pg.Client({database: "socialmedia", user: process.env.psql_user, password: process.env.psql_password})
client.connect().then(() => console.log("Connected to the database"))

async function query(query, parameters) {
    //just keep the "?? undefined". If the parameters are undefined, you have to explicitly tell the the function of thing and ahhh why did I put this "?? undefined". You know what, nevermind. It'll be useful. One day.... Never
    return await client.query(query, parameters ?? undefined);
}

module.exports = query