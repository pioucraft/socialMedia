const query = require("../../javascript/db")

async function getPost(req, body) {
    let postUrl = req.url.split("/")[5].replaceAll("+", "/")
    console.log(postUrl)
}
module.exports = getPost