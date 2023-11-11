const query = require("../javascript/db")

const handle = require("./users/handle")
const inbox = require("./users/inbox")

async function users(req) {
    let url = req.url
    if(!url.endsWith("/")) {
        url = url.concat("/")
    }
    if(url.split("/").length == 6) {
        return await handle(req)
    }
    else if(url.split("/")[5] == "inbox") {
        return await inbox(req)
    }
    else {
        return {"message": "404 Not Found", "status": 404}
    }
}

module.exports = users