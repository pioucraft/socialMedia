const pg = require("pg")

//connect to the database
const client = new pg.Client({database: "socialmedia", user: process.env.psql_user, password: process.env.psql_password})
client.connect().then(() => console.log("Connected to the database"))

async function query(query, parameters) {
    return await client.query(query, parameters ?? undefined);
}

module.exports = query