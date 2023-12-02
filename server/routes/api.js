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
const getUser = require("./api/getUser")
const follow = require("./api/follow")

async function api(req) {
    let url = new URL(req.url)
    if(url.pathname.startsWith("createAccount")) {
        return (await createAccount(req))
    }
    else if(url.pathname.startsWith("verifyEmail")) {
        return (await verifyEmail(req))
    }
    else if(url.pathname.startsWith("sendVerificationEmail")) {
        return (await sendVerificationEmail(req))
    }
    else if(url.pathname.startsWith("changeUsername")) {
        return (await changeUsername(req))
    }
    else if(url.pathname.startsWith("changeEmail")) {
        return (await changeEmail(req))
    }
    else if(url.pathname.startsWith("changeBio")) {
        return (await changeBio(req))
    }
    else if(url.pathname.startsWith("uploadFile")) {
        return (await uploadFile(req))
    }
    else if(url.pathname.startsWith("changePassword")) {
        return (await changePassword(req))
    }
    else if(url.pathname.startsWith("login")) {
        return (await login(req))
    }
    else if(url.pathname.startsWith("changeProfilePicture")) {
        return (await changeProfilePicture(req))
    }
    else if(url.pathname.startsWith("getUser")) {
        return (await getUser(req))
    }
    else if(url.pathname.startsWith("follow")) {
        return (await follow(req))
    }
    else {
        return {"message": "404 Not Found", "status": 404}
    }
}

module.exports = api
