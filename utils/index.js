const {checkPermission} = require('./checkPermissions');
const {
    createJwtToken,
    verifyToken,
    attachCookiesToResponse
} = require('./jwt');


const sendVerificationEmail = require('./sendVerificationLink');




module.exports ={
    checkPermission,
    createJwtToken,
    verifyToken,
    attachCookiesToResponse,
    sendVerificationEmail,
}