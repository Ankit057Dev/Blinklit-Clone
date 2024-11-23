import jwt from 'jsonwebtoken' // for creating the token

const generatedAccessToken = async(userId)=>{
    const token = await jwt.sign({ id : userId},
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {expiresIn :'5h'}
)// these values are passed in acordance with token creation syntax

return token
}// to generate access token for the requested userId

export default generatedAccessToken

