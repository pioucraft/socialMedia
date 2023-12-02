import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

const server = Bun.serve({
    port: process.env.PORT,
    async fetch(req) {
        console.log("request !!!")
        console.log(req)
        console.log("\n\n------------------\n\n")
        if(req.url.split("/")[3] == "api") {
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
        else if(req.url.split("/")[3] == "users") {
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
        else if(req.url.split("/")[3] == ".well-known" && req.url.split("/")[4].split("?")[0] == "webfinger") {
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
        else if(req.url.split("/")[3] == "files") {
            return new Response(Bun.file(`${__dirname}/routes/api/files/${req.url.split("/")[4]}/${req.url.split("/")[5]}`));
        }
        else {
            return new Response('404 Not Found', { status: 404 })
        }
    }
})