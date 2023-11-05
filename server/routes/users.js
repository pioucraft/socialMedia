const query = require("../javascript/db")

const handle = require("./users/handle")

async function users(req) {
    let url = req.url
    if(!url.endsWith("/")) {
        url = url.concat("/")
        console.log("url: " + url.split("/"))
    }
    if(url.split("/").length == 6) {
        return await handle(req)
    }
}

module.exports = users