const getUserJs = require("../../javascript/getuser")

async function getUser(body) {
    let user = body.user
    if(user.includes(process.env.DOMAIN)) {
        return {"message": "218 IDK", "status": 218}
    }

    return await getUserJs.getUserAsAdmin(user)
}



module.exports = getUser
