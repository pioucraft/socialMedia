const createAccount = require("./api/createAccount")
const verifyEmail = require("./api/verifyEmail")
const sendVerificationEmail = require("./api/sendVerificationEmail")
const changeUsername = require("./api/changeUsername")
const changeEmail = require("./api/changeEmail")
const changeBio = require("./api/changeBio")
const uploadFile = require("./api/uploadFile")
const changePassword = require("./api/changePassword")
const login = require("./api/login")
const changeProfilePicture = require("./api/changeProfilePicture")

async function api(req) {
    let url = req.url
    if(!url.endsWith("/")) {
        url = url.concat("/")
    }
    if(url.split("/")[4] == "createAccount") {
        return (await createAccount(req))
    }
    else if(url.split("/")[4] == "verifyEmail") {
        return (await verifyEmail(req))
    }
    else if(url.split("/")[4] == "sendVerificationEmail") {
        return (await sendVerificationEmail(req))
    }
    else if(url.split("/")[4] == "changeUsername") {
        return (await changeUsername(req))
    }
    else if(url.split("/")[4] == "changeEmail") {
        return (await changeEmail(req))
    }
    else if(url.split("/")[4] == "changeBio") {
        return (await changeBio(req))
    }
    else if(url.split("/")[4] == "uploadFile") {
        return (await uploadFile(req))
    }
    else if(url.split("/")[4] == "changePassword") {
        return (await changePassword(req))
    }
    else if(url.split("/")[4] == "login") {
        return (await login(req))
    }
    else if(url.split("/")[4] == "changeProfilePicture") {
        return (await changeProfilePicture(req))
    }
    else {
        return {"message": "404 Not Found", "status": 404}
    }
}

module.exports = api
