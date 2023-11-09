const query = require("../../javascript/db");
const fs = require("node:fs")

async function uploadFile(req) {
    let formData = await req.formData()
    let handle = formData.get("handle")
    let token = formData.get("token")
    let accountFromDb = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0]
    let realToken = accountFromDb.token
    if(realToken == token && accountFromDb.emailverification == "yes") {

        const directoryPath = `${__dirname}/files/${handle}/`;

        if (!fs.existsSync(directoryPath)){
            fs.mkdirSync(directoryPath);
        }
        let filename = formData.get("name")
        console.log(formData.get("file"))
        await Bun.write(`${__dirname}/files/${handle}/${filename}`, formData.get("file"));
        let response = {"filename": filename}
        return {"message": response, "status": 200}
    }   
    else {
        return {"message": "401 Unauthorized", "status": 401}
    }
}

module.exports = uploadFile
