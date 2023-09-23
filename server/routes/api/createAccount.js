const express = require("express")
const bodyParser = require("body-parser")
const query = require("./../../javascript/db")

const router = express.Router()
const jsonMiddleware = bodyParser.json({ type: 'application/json' });
router.use(jsonMiddleware)


router.post("/", async (req, res) => {
    try {
        let body = req.body
        let handle = body.handle
        handle = handle.toLowerCase()
        let username = body.username
        let email = body.email
        let password = body.password
        let validUsername = isLatinUsername(handle)
        if(handle && username && email && password) {
            if(handle.length > 20 || username.length > 30 || email.length > 100 || validUsername == false) {
                res.sendStatus(400)
            }
            else {
                if((await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rowCount != 0) {
                    res.status(409).send({error: "handle already taken"})
                }
                else if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    res.status(409).send({error: "email already taken"})
                }
                else {
                    let newToken = token()
                    let hash = await Bun.password.hash(password);
                    await query("INSERT INTO Users (handle, username, email, password, emailVerification, lastverificationemailsent, token) VALUES ($1, $2, $3, $4, $5, $6, $7);", [handle, username, email, hash, crypto.randomUUID(), 0, newToken])
                    res.status(200).send({"token": newToken})
                }
            }
        }
        else {
            res.status(400)
        }
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
})

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

module.exports = router
