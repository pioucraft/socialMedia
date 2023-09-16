import express from "express"
import 'dotenv/config'
import api from "./routes/api"
const app = express()
app.use("/api", api)

app.listen(Number(process.env.PORT))
