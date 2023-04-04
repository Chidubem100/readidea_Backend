
const sendEmail = require('./sendEmail');

const sendResetPasswordToken = async({username,email,resetPasswordToken,origin}) =>{

    const resetPasswordLink = `${origin}/api/v1/user/resetPassword/${resetPasswordToken}`;

    const msg = `<p>Please click on the link to reset your password : <a href='${resetPasswordLink}'>reset password</a> </p>`;

    return sendEmail({
        to: email,
        subject: 'Reset password',
        html: `<h4>Hello, ${username}</h4>,
            ${msg}        
        `
    })
}

module.exports = sendResetPasswordToken;