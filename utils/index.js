const {checkPermission} = require('./checkPermissions');
const {
    createJwtToken,
    verifyToken,
    attachCookiesToResponse
} = require('./jwt');

const {
    sendEmail
} = require('./nodemailer');

const sendVerificationEmail = require('./sendVerificationLink');



module.exports ={
    checkPermission,
    createJwtToken,
    verifyToken,
    attachCookiesToResponse,
    sendEmail,
    sendVerificationEmail,
}