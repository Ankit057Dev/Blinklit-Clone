import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'

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

        const user = await UserModel.findOne({ email})// for user already exist in database
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

        const accesstoken = await generateAccessToken(user._id)
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