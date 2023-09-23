const express = require("express")
const bodyParser = require("body-parser")
const query = require("../../javascript/db")

const router = express.Router()
const jsonMiddleware = bodyParser.json({ type: 'application/json' });
router.use(jsonMiddleware)

router.post("/", async (req, res) => {
    try {
        let body = req.body
        let email = body.email
        let password = body.password
        let truePassword = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].password
        if(await Bun.password.verify(password, truePassword)) {
            let token = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].token
            let handle = (await query("SELECT * FROM Users WHERE email = $1", [email])).rows[0].handle
            res.send({"token": token})
        }
        else {
            res.sendStatus(401)
        }
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
})




module.exports = router
