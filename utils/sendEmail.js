const nodemailerConfig = require('./nodemailerConfig');
const nodemailer = require('nodemailer');

const sendEmail = async({to,subject,html}) =>{
    let testAcc = nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: 'ReadIdea',
        to,
        subject,
        html
    });
}

module.exports = sendEmail;