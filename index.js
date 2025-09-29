import express from "express"
import cors from 'cors'
import mainRoute from './routes/main.route.js';
import mongoose from './db/db.js'
import 'dotenv/config'

const app = express()

const port = process.env.PORT;

// For converting Data into JSON
app.use(express.json());
// For converting Data into JSON

// For DB Connection
const db = mongoose.connection;

db.on("Error", (error) => {
    console.log("DB Error", error);
})

db.once("open", () => {
    console.log("DB Connected");
})
// For DB Connection

// For Accessing Data
app.use(cors());
// For Accessing Data

// For Routes
app.use("/api", mainRoute);
// For Routes

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})