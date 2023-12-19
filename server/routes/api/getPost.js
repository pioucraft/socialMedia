const query = require("../../javascript/db")

async function getPost(req, body) {
    let postUrl = req.url.split("/")[5].replaceAll("+", "/")
    let post = query("SELECT * FROM remoteposts WHERE link = $1", [postUrl])
    return post
}
module.exports = getPost