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

const query = require("../javascript/db")

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
    let testedAuthentification = await testAuthentification(body, startOfUrlPath)
    console.log(testedAuthentification)
    if(pathsThatNeedAuthentification.includes(startOfUrlPath) && testedAuthentification != true) {
        return testedAuthentification
    }
    else if(url.pathname.startsWith("/api/createAccount")) {
        return (await createAccount(req, body))
    }
    else if(url.pathname.startsWith("/api/verifyEmail")) {
        return (await verifyEmail(req))
    }
    else if(url.pathname.startsWith("/api/sendVerificationEmail")) {
        return (await sendVerificationEmail(req, body))
    }
    else if(url.pathname.startsWith("/api/changeUsername")) {
        return (await changeUsername(req, body))
    }
    else if(url.pathname.startsWith("/api/changeEmail")) {
        return (await changeEmail(req, body))
    }
    else if(url.pathname.startsWith("/api/changeBio")) {
        return (await changeBio(req, body))
    }
    else if(url.pathname.startsWith("/api/uploadFile")) {
        return (await uploadFile(req, body))
    }
    else if(url.pathname.startsWith("/api/changePassword")) {
        return (await changePassword(req, body))
    }
    else if(url.pathname.startsWith("/api/login")) {
        return (await login(req, body))
    }
    else if(url.pathname.startsWith("/api/changeProfilePicture")) {
        return (await changeProfilePicture(req, body))
    }
    else if(url.pathname.startsWith("/api/getUser")) {
        return (await getUser(req, body))
    }
    else if(url.pathname.startsWith("/api/follow")) {
        return (await follow(req, body))
    }
    else {
        return {"message": "404 Not Found", "status": 404}
    }
}

async function testAuthentification(body, startOfUrlPath) {
    try {
        if(!body.password || !body.handle) {
            return {"message": "401 Missing Authentification", "status": 401}
        }
        let handle = body.handle
        let token = body.token
        let handleFromDatabase  = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0]
        if(!handleFromDatabase) 
            return {"message": "401 Incorrect Credentials", "status": 401}
        let trueToken = handleFromDatabase.token
        let emailVerification = handleFromDatabase.emailverification
        if(trueToken != token) 
            return {"message": "401 Incorrect Credentials", "status": 401}
        if(emailVerification != "yes" && startOfUrlPath != "/sendVerificationEmail") 
            return {"message": "401 Please Verify Your Email", "status": 401}
        else 
            return true
        
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

module.exports = api
