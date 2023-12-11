const query = require("./../../javascript/db")
const sanitize = require("sanitize-html")

async function createAccount(body) {
    try {
        let handle = sanitize(body.handle).toLocaleLowerCase()
        let username = sanitize(body.username)
        let email = body.email
        let password = body.password
        
        let validUsername = isLatinUsername(handle)
        if(handle && username && email && password) {
            if(handle.length > 20 || username.length > 30 || email.length > 100 || validUsername == false) {
                return {"message": "400 Bad Request", "status": 400}
            }
            else {
                if((await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rowCount != 0) {
                    return {"message": "Handle Already Taken", "status": 409}
                }
                else if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    return {"message": "Email Already Taken", "status": 409}
                }
                else {
                    let newToken = token()
                    let hash = await Bun.password.hash(password);
                    await query("INSERT INTO Users (handle, username, email, password, emailVerification, lastverificationemailsent, token) VALUES ($1, $2, $3, $4, $5, $6, $7);", [handle, username, email, hash, crypto.randomUUID(), 0, newToken])
                    let response = {"token": newToken}
                    return {"message": response, "status": 200}
                }
            }
        }
        else {
            return {"message": "400 Bad Request", "status": 400}
        }
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "status": 500}
    }
}

var rand = function() {
    return Math.random().toString(36)
};

var token = function() {
    return rand() + rand() + rand() + rand() + rand() + rand(); 
};

function isLatinUsername(username) {
    
    var pattern = /^[a-zA-Z0-9\_]+$/;
  
    return pattern.test(username);
  }

module.exports = createAccount
