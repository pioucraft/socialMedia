const nodemailer = require("nodemailer");
const query = require("./../../javascript/db")

const transporter = nodemailer.createTransport({
    host: process.env.email_host,
    port: process.env.email_port,
    secure: true,
    auth: {
      user: process.env.email_user,
      pass: process.env.email_password,
    },
});

async function sendVerificationEmail(req) {
    try {
        let body = await req.json()
        let email = body.email
        let uuid = (await query("SELECT * FROM Users WHERE email = $1;", [email])).rows[0].emailverification
        console.log(uuid)
        if(uuid == "yes") {
            return {"message": "Success", "code": 200} 
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
                        html: `<p>Welcome to ${process.env.socialName}. Click <a href="${process.env.URL}/api/verifyEmail/${uuid}">here</a> to confirm your email. If you didn't try to create an account, you can just ignore this email.</p>`, 
                    });
                    query("UPDATE Users SET lastVerificationEmailSent = $1 WHERE email = $2;", [date.getTime(), email])
                      
                    return {"message": "Success", "code": 200} 
                }
                else {
                    return {"message": "429 Too Many Requests", "code": 429}
                }
                    
                
            }
            else {
                return {"message": "404 Not Found", "code": 404}
            }
        }

        
    }
    catch(err) {
        return {"message": "500 Internal Server Error", "code": 500}
        console.log(err)
    }

}

module.exports = sendVerificationEmail