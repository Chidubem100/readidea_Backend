const {checkPermission} = require('./checkPermissions');
const {
    createJwtToken,
    verifyToken,
    attachCookiesToResponse
} = require('./jwt');


const sendVerificationEmail = require('./sendVerificationLink');

const sendResetPasswordToken = require('./sendResetPasswordToken');



module.exports ={
    checkPermission,
    createJwtToken,
    verifyToken,
    attachCookiesToResponse,
    sendVerificationEmail,
    sendResetPasswordToken
}