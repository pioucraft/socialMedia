const express = require("express")
const bodyParser = require("body-parser")
const query = require("../../javascript/db")

const router = express.Router()
const jsonMiddleware = bodyParser.json({ type: 'application/json' });
router.use(jsonMiddleware)


router.post("/", async (req, res) => {
    try {
        let body = req.body
        let handle = body.handle
        let username = body.username
        let token = body.token
        if(username.length > 20) {
            res.sendStatus(400)
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].emailverification != "yes") {
                    res.status(401).send({"message": "please verify your email"})
                }
                else {
                    await query("UPDATE Users SET username = $1 WHERE handle = $2", [username, handle])
                    res.sendStatus(200)
                }

            }
            else {
                res.sendStatus(401)
            }
        }
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
})




module.exports = router
