const express = require("express")
const query = require("./../../javascript/db")

const router = express.Router()

router.get("/:uuid", async (req, res) => {
    try {
        let uuid = req.params.uuid
        
        if(uuid == "yes") {
            res.sendStatus(404)
        }
        else {
            await query("UPDATE Users SET emailVerification = 'yes' WHERE emailVerification ~* $1;", [uuid])
            res.sendStatus(200)
        }   
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }
})

module.exports = router