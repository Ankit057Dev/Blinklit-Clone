import {Router } from 'express'
import {loginController, logoutContoller, registerUserController, verifyEmailController} from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'



const userRouter = Router()


userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailController)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutContoller)// get method used becoause no request will be sent from client side 

export default userRouter