import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

const server = Bun.serve({
    port: process.env.PORT,
    async fetch(req) {
        if(req.url.startsWith(`${process.env.URL}/api/`)) {
            let response = await api(req)
            if(typeof response.message == "object") {
                return new Response(JSON.stringify(response.message), {
                    headers: { "Content-Type": "application/json" },
                    status: response.status
                })
            }
            else {
                return new Response(response.message)
            }
            
        }
        else if(req.url.startsWith(`${process.env.URL}/users/`)) {
            let response = await users(req)
            if(typeof response.message == "object") {
                return new Response(JSON.stringify(response.message), {
                    headers: { "Content-Type": "application/json" },
                    status: response.status
                })
            }
            else {
                return new Response(response.message)
            }
        }
        else if(req.url.startsWith(`${process.env.URL}/.well-known/webfinger`)) {
            let response = await webfinger(req)
            if(typeof response.message == "object") {
                return new Response(JSON.stringify(response.message), {
                    headers: { "Content-Type": "application/json" },
                    status: response.status
                })
            }
            else {
                return new Response(response.message)
            }
        }
        else if(req.url.startsWith(`${process.env.URL}/files/`)) {
            return new Response(Bun.file(`${__dirname}/routes/api/files/${req.url.split("/")[4]}/${req.url.split("/")[5]}`));
        }
        else {
            return new Response('404 Not Found', { status: 404 })
        }
    }
})