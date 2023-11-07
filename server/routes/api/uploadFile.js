const query = require("../../javascript/db");
const fs = require("node:fs")

async function uploadFile(req) {
    let formData = await req.formData()
    let handle = formData.get("handle")
    let token = formData.get("token")
    let realToken = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].token
    if(realToken == token) {

        const directoryPath = `${__dirname}/files/${handle}/`;

        if (!fs.existsSync(directoryPath)){
            fs.mkdirSync(directoryPath);
        }
        let filename = formData.get("name")
        console.log(formData.get("file"))
        await Bun.write(`${__dirname}/files/${handle}/${filename}`, formData.get("file"));
        return JSON.stringify({"filename": filename})
    }   
    else {
        return {"message": "401 Unauthorized", "code": 401}
    }
}

module.exports = uploadFile
