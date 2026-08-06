import dotenv from "dotenv";
dotenv.config()
// const DB_URL=process.env.MONGODB_URI
const URL = process.env.URL
import mongoose from "mongoose";

mongoose.connect(URL)

const db= mongoose.connection

db.on('error',console.error.bind(console,'error connecting to DB'))

db.once('open',()=>{
    console.log("successfully Connected to your DataBase")
})

export default db

// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         const connection = await mongoose.connect(process.env.URL);

//         console.log(
//             `MongoDB Connected: ${connection.connection.host}`
//         );
//     } catch (error) {
//         console.error("Database Connection Failed");
//         console.error(error.message);
//         process.exit(1);
//     }
// };

// export default connectDB;