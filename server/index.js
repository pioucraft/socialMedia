//import express from "express"
import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

/*const app = express()
app.use("/api", api)
app.use("/.well-known/webfinger", webfinger)
app.use("/users", users)

app.use("/images", express.static("./routes/api/images"))

app.listen(Number(process.env.PORT))*/


const server = Bun.serve({
    port: process.env.PORT,
    async fetch(req) {
        if(req.url.startsWith(`${process.env.URL}/api/`)) {
            let response = await api(req)
            console.log(response)
            if(response.code) {
                return new Response(response.message, {status: response.code})
            }
            else {
                return new Response(response)
            }
            
        }
        else if(req.url.startsWith(`${process.env.URL}/users/`)) {
            let response = await users(req)
            if(response.code) {
                return new Response(response.message, {status: response.code})
            }
            else {
                return new Response(response)
            }
        }
        else if(req.url.startsWith(`${process.env.URL}/.webifinger/`)) {
            let response = await webfinger(req)
            if(response.code) {
                return new Response(response.message, {status: response.code})
            }
            else {
                return new Response(response)
            }
        }
        else {
            return new Response('Not Found', { status: 404 })
        }
    }
})