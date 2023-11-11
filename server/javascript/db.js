const pg = require("pg")

const client = new pg.Client({database: "socialmedia", user: process.env.psql_user, password: process.env.psql_password})
client.connect().then(() => console.log("connected to the database"))



async function query(query, parameters) {
    if(parameters === undefined) {
        return await client.query(query)
    }
    else {
        return await client.query(query, parameters)
    }
}

module.exports = query
