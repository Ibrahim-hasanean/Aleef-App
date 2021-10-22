import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const databaseUrl = process.env.DATABASE_URL as string;

mongoose.connect(databaseUrl).then(() => {
    console.log("database connected");
}).catch(e => {
    console.log(e);
})