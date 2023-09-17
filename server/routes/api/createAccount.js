const express = require("express")
const bodyParser = require("body-parser")
const pg = require("pg")

const router = express.Router()
const jsonMiddleware = bodyParser.json({ type: 'application/json' });
router.use(jsonMiddleware)

const client = new pg.Client({database: "test", user: "postgres"})
client.connect().then(() => console.log("connected to the database"))


router.post("/", async (req, res) => {
    try {
        let body = req.body
        let handle = body.handle
        let username = body.username
        let email = body.email
        let password = body.password
        if(handle && username && email && password) {
            if(handle.length > 20 || username.length > 30 || email.length > 100) {
                res.status(400)
            }
            else {
                if((await client.query("SELECT * FROM Users WHERE handle ~* $1;", [handle])).rowCount != 0) {
                    res.status(409).send({error: "handle already taken"})
                }
                else if((await client.query("SELECT * FROM Users WHERE email ~* $1;", [email])).rowCount != 0) {
                    res.status(409).send({error: "email already taken"})
                }
                else {
                    //create a file for all the db requests
                    res.send("sucess")
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

module.exports = router
