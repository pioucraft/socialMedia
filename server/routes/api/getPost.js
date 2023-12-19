const query = require("../../javascript/db")

async function getPost(req) {
    let postUrl = req.url.split("/")[5].replaceAll("+", "/")
    let post = (await query("SELECT * FROM remoteposts WHERE link = $1", [postUrl])).rows[0]
    console.log(post)
    return {"message": post, "status": 200}
}
module.exports = getPost