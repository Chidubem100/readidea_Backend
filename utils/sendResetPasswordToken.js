const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async({username,email,token,origin}) =>{

    const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;

    const msg = `<p>Please reset your password by clicking the link : <a href='${resetUrl}'>Reset Password</a> </p>`;

    return sendEmail({
        to: email,
        subject: 'Reset Password',
        html: `<h4>Hello, ${username}</h4>,
            ${msg}        
        `
    })
}



module.exports = sendResetPasswordEmail;