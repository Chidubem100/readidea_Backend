
const sendEmail = require('./sendEmail');

const sendVerificationEmail = async({username,email,verificationToken,origin}) =>{

    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

    const msg = `<p>Please confrirm your email by clicking on the link : <a href='${verifyEmail}'>verify email</a> </p>`;

    return sendEmail({
        to: email,
        subject: 'Email confirmation',
        html: `<h4>Hello, ${username}</h4>,
            ${msg}        
        `
    })
}



module.exports = sendVerificationEmail;