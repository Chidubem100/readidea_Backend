const nodemailer = require('nodemailer');

const sendEmail = async (message, req, res) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: 'ReadIdea',
        to: message.to,
        subject: message.subject,
        html: message.html
    });

    console.log('Message sent: %s', info.messageId);

};

module.exports = {sendEmail};

