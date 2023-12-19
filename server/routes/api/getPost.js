const query = require("../../javascript/db")

async function getPost(req, body) {
    let postUrl = req.url.split("/")[5].replaceAll("+", "/")
    let post = (await query("SELECT * FROM remoteposts WHERE link = $1", [postUrl])).rows[0]
    console.log(post)
    return post
}
module.exports = getPost