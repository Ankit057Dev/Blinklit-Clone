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


        const VerifyEmailUrl = ""
        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from blinkitClone",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })

        })


        
            } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}