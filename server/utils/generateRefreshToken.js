const generateRefreshToken = async(userId)=>{
    
const token = await jwt.sign({ id : userId},
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {expiresIn :'7d'}
)


//when access token expires to validate refresh token or check that is it available or not in database

const updateRefreshTokenUser = await UserModel.updateOne({_id: userId},
    {refresh_token : token}
)// to check user availabe in database
return token
}

export default generateRefreshToken