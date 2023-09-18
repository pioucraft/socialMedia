import express from "express"
import 'dotenv/config'
import api from "./routes/api"

const app = express()
app.use("/api", api)

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "gougoule.ch",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "test@gougoule.ch",
      pass: "test12345",
    },
});

async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <hi@gougoule.ch>', // sender address
      to: "nathan.pioucraft@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world", // plain text body
      html: "<p>click <a href='https://gougoule.ch'>here</a></p>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }
  
  main().catch(console.error);

app.listen(Number(process.env.PORT))
