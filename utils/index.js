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
const sendResetPasswordEmail = require('./sendResetPasswordToken');
const createHash = require('./createHash');


module.exports ={
    checkPermission,
    createJwtToken,
    verifyToken,
    attachCookiesToResponse,
    sendEmail,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
}