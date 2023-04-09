
const CustomApiError = require('../errors/index');
const Token = require('../models/token');
const {attachCookiesToResponse} = require('../utils');
const{verifyToken } = require('../utils');

const authenticate = (req,res,next) =>{

    const {accessToken, refreshToken} = req.signedCookies;

    

    try {
        if(accessToken){
            const payload = verifyToken(accessToken);
            req.user = payload.user;
            return next()
        }    

        const payload =  verifyToken(accessToken);
        const existingToken = Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken
        });

        if(!existingToken || !existingToken?.isValid){
            throw new CustomApiError.UnauthenticatedError('Authentication Failed')
        }

        attachCookiesToResponse({res, user: payload.user, refreshToken:existingToken.refreshToken});
        req.user = payload.user;
        next();
    } catch (error) {
        throw new CustomApiError.BadRequestError('Authentication failed');
    }
    

}


const authorizeUser = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            throw new CustomApiError.UnauthorizedError('Unauthorized for users')
        }
        next();
    }
}

module.exports = {
    authenticate,
    authorizeUser,
}