
const {verifyToken} = require('../utils/index');
const CustomApiError = require('../errors/index');


const authenticate = (req,res,next) =>{

    const token = req.signedCookies.token;
    if(!token){
        throw new CustomApiError.BadRequestError('Authentication failed')
    }

    try {
        const {username,role,userId} = verifyToken({token});
        req.user = {username,role,userId}
        next()
    } catch (error) {
        throw new CustomApiError.BadRequestError('Authentication failed');
    }
    // create token from signedCookies
    // check if token is created or user is authenticated
    // verifytoken

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