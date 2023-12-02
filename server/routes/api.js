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
    let pathsThatNeedAuthentification = [
        "/sendVerificationEmail",
        "/changeUsername",
        "/changeEmail",
        "/changeBio",
        "/uploadFile",
        "/changePassword",
        "/changeProfilePicture",
        "/follow"
    ]
    let startOfUrlPath = `/${url.pathname.split("/")[2]}`
    console.log(startOfUrlPath)
    let body = await req.json()
    let testedAuthentification = await testAuthentification(body)
    if(pathsThatNeedAuthentification.includes(startOfUrlPath) && testedAuthentification != true) {
        return testedAuthentification
    }
    else if(url.pathname.startsWith("/api/createAccount")) {
        return (await createAccount(req))
    }
    else if(url.pathname.startsWith("/api/verifyEmail")) {
        return (await verifyEmail(req))
    }
    else if(url.pathname.startsWith("/api/sendVerificationEmail")) {
        return (await sendVerificationEmail(req))
    }
    else if(url.pathname.startsWith("/api/changeUsername")) {
        return (await changeUsername(req))
    }
    else if(url.pathname.startsWith("/api/changeEmail")) {
        return (await changeEmail(req))
    }
    else if(url.pathname.startsWith("/api/changeBio")) {
        return (await changeBio(req))
    }
    else if(url.pathname.startsWith("/api/uploadFile")) {
        return (await uploadFile(req))
    }
    else if(url.pathname.startsWith("/api/changePassword")) {
        return (await changePassword(req))
    }
    else if(url.pathname.startsWith("/api/login")) {
        return (await login(req))
    }
    else if(url.pathname.startsWith("/api/changeProfilePicture")) {
        return (await changeProfilePicture(req))
    }
    else if(url.pathname.startsWith("/api/getUser")) {
        return (await getUser(req))
    }
    else if(url.pathname.startsWith("/api/follow")) {
        return (await follow(req))
    }
    else {
        return {"message": "404 Not Found", "status": 404}
    }
}

async function testAuthentification(body) {
    try {
        if(!body.contains("password") || !body.contains("handle")) {
            return {"message": "401 Missing Authentification", "status": 401}
        }
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = api
