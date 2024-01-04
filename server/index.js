import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

const server = Bun.serve({
    port: process.env.PORT,
    async fetch(req) {
        try {
            let acceptHeaders = req.headers.get("accept") ?? ""
            if(acceptHeaders.includes("*/*") || acceptHeaders.includes("text/html")) {
                let path = new URL(req.url).pathname
                let file = Bun.file(`${__dirname}/../client${path}`)
                if(await file.exists()) {
                    return new Response(file)
                }
                else {
                    file = Bun.file(`${__dirname}/../client/404.html`)
                    return new Response(file, {status: 404})
                }
                    
                
            }
            else if(req.url.split("/")[3] == "api") {
                let response = await api(req)
                return returnGenerator(response)
                
            }
            else if(req.url.split("/")[3] == "users") {
                let response = await users(req)
                return returnGenerator(response)
            }
            else if(req.url.split("/")[3] == ".well-known" && req.url.split("/")[4].split("?")[0] == "webfinger") {
                let response = await webfinger(req)
                return returnGenerator(response)
            }
            else if(req.url.split("/")[3] == "files") {
                return new Response(Bun.file(`${__dirname}/routes/api/files/${req.url.split("/")[4]}/${req.url.split("/")[5]}`));
            }
            else {
                return new Response('404 Not Found', { status: 404 })
            }
        }
        catch(err) {
            console.log(err)
            return new Response("500 Internal Server Error", {status: 500})
        }
        
    }
})

function returnGenerator(response) {
    if(typeof response.message == "object") {
        return new Response(JSON.stringify(response.message), {
            headers: { "Content-Type": "application/json" },
            status: response.status
        })
    }
    else {
        return new Response(response.message, {status: response.status})
    }
}