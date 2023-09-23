import express from "express"
import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"
import users from "./routes/users"

const app = express()
app.use("/api", api)
app.use("/.well-known/webfinger", webfinger)
app.use("/users", users)

app.listen(Number(process.env.PORT))
