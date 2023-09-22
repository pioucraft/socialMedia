const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer");
const query = require("./../../javascript/db")

const router = express.Router()
const jsonMiddleware = bodyParser.json({ type: 'application/json' });
router.use(jsonMiddleware)

const transporter = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_email_port,
    secure: true,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_password,
    },
});

router.post("/", async (req, res) => {
    try {
        let body = req.body
        let email = body.email
        let uuid = (await query("SELECT * FROM Users WHERE email = $1;", [email])).rows[0].emailverification
        console.log(uuid)
        if(uuid == "yes") {
            res.sendStatus(200)
        }
        else {
            let date = new Date()
            if ((await query("SELECT * FROM Users WHERE email = $1 AND emailVerification = $2", [email, uuid])).rowsCount != 0 ) {
                if ((date.getTime() - (await query("SELECT * FROM Users WHERE email = $1;", [email])).rows[0].lastverificationemailsent)/1000 > 30) {
                    const info = await transporter.sendMail({
                        from: `${process.env.socialName} <${process.env.email_user}>`, 
                        to: email, 
                        subject: "Confirm your email", 
                        text: `Welcome to ${process.env.socialName}. Click here to confirm your email.`, 
                        html: `<p>Welcome to ${process.env.socialName}. Click <a href="https://${process.env.URL}/api/verifyEmail/${uuid}">here</a> to confirm your email. If you didn't try to create an account, you can just ignore this email.</p>`, 
                    });
                    query("UPDATE Users SET lastVerificationEmailSent = $1 WHERE email = $2;", [date.getTime(), email])
                      
                    res.sendStatus(200) 
                }
                else {
                    res.sendStatus(429)
                }
                    
                
            }
            else {
                res.sendStatus(404)
            }
        }

        
    }
    catch(err) {
        res.sendStatus(500)
        console.log(err)
    }

})

module.exports = router