import express from 'express'
import cors from  'cors'
import dotenv from 'dotenv' // to access frontend url inside ths file
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan' // it is logger when an api is called displayed inside the termianl
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
const app = express()
app.use(cors({
    credentials : true,
    origin: process.env.FRONTEND_URL // for accessing cookies in client side
}))

//for coverrsion of response to json

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({

    crossOriginResourcePolicy : false  // to avoid error during we use frontend and to avoid backend in other domain error

}))
// so this was the configuration part which is done

// now we will add port to run server as when server runs it uses a specific port

const PORT = 8080 || process.env.PORT //to avoid port busy in some cases we add env port

app.get("/",(request,response)=>{
   // to send data from server to clientt side 
     response.json({
        message : "Server is running" + PORT
     })
})


app.use('api/user',userRouter)


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running",PORT)
    })
})
