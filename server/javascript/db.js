const pg = require("pg")

const client = new pg.Client({database: "socialMedia", user: "postgres"})
client.connect().then(() => console.log("connected to the database"))

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