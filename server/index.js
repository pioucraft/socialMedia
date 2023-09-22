import express from "express"
import 'dotenv/config'
import api from "./routes/api"
import webfinger from "./routes/webfinger"

const app = express()
app.use("/api", api)
app.use("/.well-known/webfinger", webfinger)

app.listen(Number(process.env.PORT))
