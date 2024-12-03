const forgotPasswordTemplate = ({name,otp}) =>{
return `
<div>
    <p>Dear, ${name}</p>
    <p>Here is your OTP for password reset: </p></br>

    <p> this otp is valid for 1 hour only. Enter this otp in the blinkit website to proceed with resetting your password.</p></br>

    <div style = "background:yellow;font-size:20px">
    <p>Requested Otp is :  ${otp}</p>
    </div></br>


    <p>Best regards, BlinkitClone Team</p>


</div>


`
}


export default forgotPasswordTemplate