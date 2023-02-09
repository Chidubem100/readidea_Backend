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


const verifyToken = ({token}) =>{
    const x = jwt.verify(token, process.env.JWT_SECRET)
    return x;
};


const attachCookiesToResponse = ({res,user}) =>{
    const token = createJwtToken({payload: user})


    // cookies setup
    const oneDay = 1000 * 60 * 60 *24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true        
    });
};


module.exports = {
    createJwtToken,
    verifyToken,
    attachCookiesToResponse
}

