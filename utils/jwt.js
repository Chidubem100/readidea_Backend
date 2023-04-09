const jwt = require('jsonwebtoken');

const createJwtToken = ({payload}) =>{
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES
        }
    );
    return token; 
};


const verifyToken = (token) =>{
    const x = jwt.verify(token, process.env.JWT_SECRET)
    return x;
};


const attachCookiesToResponse = ({res,user,refreshToken}) =>{
    const accesssTokenJ = createJwtToken({payload: {user}})
    const refreshTokenJ = createJwtToken({payload: {user,refreshToken}})

    // cookies setup
    const oneDay = 1000 * 60 * 60 * 24;
    const longExp = 1000 * 60 * 60 * 24 * 30;


    res.cookie('accessToken', accesssTokenJ, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true        
    });

    res.cookie('refreshToken', refreshTokenJ, {
        httpOnly: true,
        expires: new Date(Date.now() + longExp),
        secure: process.env.NODE_ENV === 'production',
        signed: true        
    });
};


module.exports = {
    createJwtToken,
    verifyToken,
    attachCookiesToResponse
}

