const forgotPasswordTemplate = ({name,otp}) =>{
return `
<div>
    <p>Dear, ${name}</p>
    <p>Here is your OTP for password reset: </p></br>

    <p> this otp is valud for 1 hpur only. Enter this otp in the blinkit website to proceed with resetting your password.</p></br>

    <p>Best regards, BlinkitClone Team</p>


</div>


`
}