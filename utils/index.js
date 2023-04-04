const {checkPermission} = require('./checkPermissions');
const {
    createJwtToken,
    verifyToken,
    attachCookiesToResponse
} = require('./jwt');


const sendVerificationEmail = require('./sendVerificationLink');
const sendResetPasswordEmail = require('./sendResetPasswordToken');
const createHash = require('./createHash');



module.exports ={
    checkPermission,
    createJwtToken,
    verifyToken,
    attachCookiesToResponse,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
}