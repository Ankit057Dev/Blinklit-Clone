import express from 'express'
import cors from  'cors'
import dotenv from 'dotenv' // to access frontend url inside ths file
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan' // it is logger when an api is called displayed inside the termianl
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
const app = express()
app.use(cors({
    credentials : true,
    origin: process.env.FRONTEND_URL, // for accessing cookies in client side
    // methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

//for coverrsion of response to json

app.use(express.json())
app.use(express.urlencoded({extended:true}))
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


app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("server is running",PORT)
})})