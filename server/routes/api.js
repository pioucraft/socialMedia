const createAccount = require("./api/createAccount")
const verifyEmail = require("./api/verifyEmail")
const sendVerificationEmail = require("./api/sendVerificationEmail")
const changeUsername = require("./api/changeUsername")
const changeEmail = require("./api/changeEmail")
const changeBio = require("./api/changeBio")
const uploadImage = require("./api/uploadImage")
const changePassword = require("./api/changePassword")
const login = require("./api/login")
const changeProfilePicture = require("./api/changeProfilePicture")

async function api(req) {
    let url = req.url
    if(!url.endsWith("/")) {
        url = url.concat("/")
    }
    if(url.split("/")[4] == "createAccount") {
        return await createAccount(req)
    }
    else if(url.split("/")[4] == "verifyEmail") {
        return await verifyEmail(req)
    }
    else if(url.split("/")[4] == "sendVerificationEmail") {
        return await sendVerificationEmail(req)
    }
    else if(url.split("/")[5] == "changeUsername") {
        return await changeUsername(req)
    }
    else if(url.split("/")[5] == "changeEmail") {
        return await changeEmail(req)
    }
    else if(url.split("/")[5] == "changeBio") {
        return await changeBio(req)
    }
    else if(url.split("/")[5] == "uploadImage") {
        return await uploadImage(req)
    }
    else if(url.split("/")[5] == "changePassword") {
        return await changePassword(req)
    }
    else if(url.split("/")[5] == "login") {
        return await login(req)
    }
    else if(url.split("/")[5] == "changeProfilePicture") {
        return await changeProfilePicture(req)
    }
}

module.exports = api
