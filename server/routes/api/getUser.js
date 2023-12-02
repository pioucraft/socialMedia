const getUserJs = require("../../javascript/getuser")

async function getUser(body) {
    try {
        let user = body.user
        if(user.includes(process.env.DOMAIN)) {
            return {"message": "218 IDK", "status": 218}
        }

        return await getUserJs.getUserAsAdmin(user)
    }
    catch(err) {
        console.log(err)
        return {"message": "500 Internal Server Error", "status": 500}
    }
}



module.exports = getUser
