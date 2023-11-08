import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

const server = Bun.serve({
    port: process.env.PORT,
    async fetch(req) {
        console.log(typeof req.url)
        console.log(req.url)
        //very important, check if the /api/ is contained in the correct place of the url. If a user is named api, it will break everything. !!!!! do it for everything else in the file
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
        else if(req.url.split("/")[3] == ".well-known" && req.url.split("/")[4] == "webfinger") {
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
        else if(req.url.contains(`/files/`)) {
            return new Response(Bun.file(`${__dirname}/routes/api/files/${req.url.split("/")[4]}/${req.url.split("/")[5]}`));
        }
        else {
            return new Response('404 Not Found', { status: 404 })
        }
    }
})