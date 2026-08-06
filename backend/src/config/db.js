import dotenv from "dotenv";
dotenv.config()
const DB_URL=process.env.MONGODB_URI
const URL = process.env.URL
import mongoose from "mongoose";

mongoose.connect(URL)

const db= mongoose.connection

db.on('error',console.error.bind(console,'error connecting to DB'))

db.once('open',()=>{
    console.log("successfully Connected to your DataBase")
})

export default db