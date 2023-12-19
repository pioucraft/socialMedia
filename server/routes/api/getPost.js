const query = require("../../javascript/db")

async function getPost(req, body) {
    let postUrl = req.headers.get("url")
    console.log(postUrl)    
}
module.exports = getPost