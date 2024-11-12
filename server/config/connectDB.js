import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error(
        "please provide MONGODB_URI inn the new .env file "
    )
}

async function connectDB(){
    try{

        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected DB")

    }catch (error){
        console.log("Mongodb connection error",error)
        process.exit(1)
    }
}

export default connectDB