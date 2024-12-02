import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import sendEmail from '../config/sendEmail.js'
import jwt from 'jsonwebtoken'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import generateOtp from '../utils/generateOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'

export async function registerUserController(request,response){
    try {
        const {name , email , password} = request.body// to fill required field during registration

        if(!name || !email || !password){
            return response.status(400).json({
                message: 'provide email ,name , password',
                error : true,
                success : false 
            })
        }

        const user = await UserModel.findOne({email})// for user already exist in database
        if (user){
            return response.json({
                message: 'user already exists',
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)// to convert user password into hash for security purpose 
        

        const payload = {
            name,
            email,
            password : hashPassword
        }// to get the data provided by the user for storing in database

        const newUser = new UserModel(payload)
        const save = await newUser.save()//to save the data provided by user in the database


        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}` // get triggered when user click verify button in frontend
        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from blinkitClone",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })

        })


        return response.json({
            message : "User Register successfully",
            error : false,
            success : true,
            data : save

        })


        
            } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export async function verifyEmailController(request,response) {

    try {
        const {code} = request.body // verification code when user click on verify email link

        const user = await UserModel.findOne({_id: code})  // to check user in database 

        if(!user){
            return response.status(400).json(
            {
                message : "invalid code",
                error : true, 
                success : false
            }
            )

        } // if code entered is invalid


        // now for updating field with valid user 

        const updateUsers = await UserModel.updateOne({_id : code},{
            verify_email : true
        } )

        return response.json({
            messsage: "verification done",
            success : true,
            error : false

        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success :  true
        })
    }
    
}

//login controller

export async function loginController(request,response){
    try { 
        const {email ,password } = request.body// to get user login details

        //adding validation 
        if(!email || !password){
            return response.status(400).json({
                message : "provide email,password",
                error : true,
                success : false
            })
        }

        // to check email id exist in db or not 
        const user = await UserModel.findOne({email})


        if(!user){
            return response.status(400).json({
                message : "User does not exist please Register First",
                error : true,
                success : false
        })}

        // to check user email or user is active/inactive/suspended
        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to admin",
                error : true,
                success : false
            })
        }

        // decrypt password that was stored above in the form of encryption to verify stored login password
        const checkPassword = await bcryptjs.compare(password,user.password)
        if (!checkPassword){
            return response.status(400).json({
                message : "Check Entered Passssword ",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        const cookiesOption ={
            httpOnly : true,
            secure : true,
            sameSite : "None"// to set tokens inside cookies independent of site
        }
        response.cookie('accessToken',accesstoken,cookiesOption)// to send these tokens to user cookies
        response.cookie('refreshToken',refreshToken,cookiesOption)
       

        return response.json({
            message : "Login Successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken// in case of mobile for default cookie save
            }
        })
    }catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }} 

    //logout controller

    export async function logoutContoller(request,response){
        try 
        {

            // adding middleware to remove refresh token from user database
            const userid = request.userId//middleware
            

            const cookiesOption = {
                httpOnly : true,
                secure : true,
                sameSite:"None"
            }// added cookie option to remove saved cookies


            response.clearCookie("accessToken",cookiesOption)
            response.clearCookie("refreshToken",cookiesOption)// to remove saved cookies

            const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
                refresh_token : ""
            })// remove refresh token from db


            return response.json({
                message : "Logout Successfully",
                error :false,
                success : true
            })
        } catch (error) {
            return response.status.json({
                message : error.message || error,
                error : true,
                success : false 
            })
        }
    }

    //upload user avatar

    export async function uploadAvatar (request,response){

        try {
            //to get image file we use multer packages visit multer we for config
            const userId = request.userId // auth middleware
            const image = request.file // multer middleware

            const upload = await uploadImageCloudinary(image)// to upload image at cloudinary

            const updateUser = await UserModel.findByIdAndUpdate(userId,{
                avatar : upload.url
            })



            return response.json({
                message : "upload profile",
                data : {
                    _id : userId,
                    avatar : upload.url
                }
            })

        } catch (error) {
            return respone.status(500).json({
                message :error.message || error,
                error : true,
                success: false
            })
        }

    }

    //update user details

    export async function updateUserDetails(request,response) {
        try {
            const userId = request.userId //auth middleware to only allow logined user
            const {name,email,mobile,password} =request.body

            let hashPassword = ""

            if(password){
                const salt = await bcryptjs.genSalt(10)
                hashPassword = await bcryptjs.hash(password,salt)
            }

            const updateUser = await UserModel.updateOne({_id :userId},{
                ...(name && {name : name}),
                ...(email && {email : email}),
                ...(mobile && {mobile: mobile}),
                ...(password && {password : hashPassword})
            })

            
            return response.json({
                message : "update user details successful",
                error : false,
                success : true,
                data : updateUser
            })

        } catch (error) {

            return response.status(500).json({
                message : error.message || error,
                error : true,
                success : false
            })
            
        }
    }

//forgot password without login

export async function forgotPasswordController(request,response){
    try {
        const {email} = request.body

        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "Email not registered!...Enter correct one",
                error : true,
                success : false
        })}

        const otp = generateOtp()
        const expireTime = new Date() + 60 * 60 * 1000  //1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()// in indian time frame

        })

        // to send email

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from Blinkit Clone",
            html: forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })


        return response.json({
            message : "check your email",
            error : false,
            success : true
        })




    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//verify forgot password otp 

export async function verifyForgotPasswordOtp(request,response){
    try {
        const {email , otp } = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide Required Field Email and Otp",
                error : true,
                success : false
        })}

        const user = await UserModel.findOne({ email })
        if(!user){
            return response.status(404).json({
                message : "Email not Available",
                error : true,
                success : false
        })}
    } catch (error) {

        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }
}
