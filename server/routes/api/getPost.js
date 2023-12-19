const query = require("../../javascript/db")

async function getPost(req, body) {
    let postUrl = decodeURIComponent(req.url.split("/")[5])
    console.log(postUrl)
}
module.exports = getPost