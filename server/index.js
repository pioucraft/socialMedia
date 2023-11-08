import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

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
                if(response.startsWith("{")) {
                    return new Response(response, {
                        headers: { "Content-Type": "application/json" },
                    })
                }
                else {
                    return new Response(response)
                }
            }
            
        }
        else if(req.url.startsWith(`${process.env.URL}/users/`)) {
            let response = await users(req)
            if(response.code) {
                return new Response(response.message, {status: response.code})
            }
            else {
                if(response.startsWith("{")) {
                    return new Response(response, {
                        headers: { "Content-Type": "application/json" },
                    })
                }
                else {
                    return new Response(response)
                }
            }
        }
        else if(req.url.startsWith(`${process.env.URL}/.well-known/webfinger`)) {
            let response = await webfinger(req)
            if(response.code) {
                return new Response(response.message, {status: response.code})
            }
            else {
                if(response.startsWith("{")) {
                    return new Response(response, {
                        headers: { "Content-Type": "application/json" },
                    })
                }
                else {
                    return new Response(response)
                }
            }
        }
        else {
            return new Response('Not Found', { status: 404 })
        }
    }
})