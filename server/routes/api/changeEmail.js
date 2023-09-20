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
        let email = body.email
        let token = body.token
        if(handle.length > 20) {
            res.sendStatus(400)
        }
        else {
            let trueToken = (await query("SELECT * FROM Users WHERE handle = $1", [handle])).rows[0].token
            if(trueToken == token) {
                if((await query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    res.status(409).send({error: "email already taken"})
                }
                else {
                    await query("UPDATE Users SET email = $1 WHERE handle = $2", [email, handle])
                    await query("UPDATE Users Set emailVerification = $1 WHERE HANDLE = $2", [crypto.randomUUID(), handle])
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
