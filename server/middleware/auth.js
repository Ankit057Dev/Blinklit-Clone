//third parameter next is also used because it is a middleware and it will also go on next route
import jwt from 'jsonwebtoken'
const auth = async(request,response,next) =>{
try {
    const token = request.cookies.accessToken || request?.header?.authorization?.split(" ")[1] // to get the saved tokens in userdb and in || or case to get tokens in mobile phone
    // do console token here before proceeding

    if(!token){
        return response.status(401).json({
            message : "Provide Token"
        })// if token not available
    }
    //if token available then we will decrypt the token

    const decode = await jwt.verify(token,process.env.SECRET_KEY_ACCESS_TOKEN)
    // do decode token here before proceeding

    if(!decode){
        return response.status(401).json({
            message : "Unauthorized Access",
            error : true,
            success : false
        })
    }
    request.userId = decode.id

    next()
    
} catch (error) {
    return response.status(500).json({
        message: error.message || error,
        error : true,
        success : false
    })
}
}
export default auth 