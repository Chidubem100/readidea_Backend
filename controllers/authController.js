const {attachCookiesToResponse, sendVerificationEmail,createHash,sendResetPasswordEmail} = require('../utils/index');
const User = require('../models/User');
const CustomApiError = require('../errors/index');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');
const Token = require('../models/token');
// const { handleLogin } = require('../utils/socket');



const register = async(req,res) =>{
    
    const {email,username,password} = req.body;

    if(!email || !username || !password){
        throw new CustomApiError.BadRequestError('Please provide the needed values')
    }

    const usernameExists = await User.findOne({username});
    if(usernameExists){
        throw new CustomApiError.BadRequestError('Username already taken, choose another username')
    }

    const emailAlreadyExist = await User.findOne({email});
    if(emailAlreadyExist){
        throw new CustomApiError.BadRequestError('Email already exists, please pick a new email')
    } 

    const isFirstUser = await User.countDocuments({}) === 0;
    const role = isFirstUser ? 'admin' : 'user'

    const verificationToken = crypto.randomBytes(40).toString('hex');
    

    const user = await User.create({email, username, password, role, verificationToken});

    const origin = 'http://localhost:3000' // will still be changed

    await sendVerificationEmail({
        username: user.username,
        email: user.email,
        verificationToken: user.verificationToken,
        origin
    });
    
    console.log(user)
    
    res.status(StatusCodes.CREATED)
    .json({
        success: true, 
        msg: 'Please check your email to verify your account', 
        // verificationToken: user.verificationToken
    }); 
}

const verifyEmail = async(req,res) =>{

    const {email, verificationToken} = req.body;

    if(!email){
        throw new CustomApiError.BadRequestError('Please provide the needed values')
    }

    const user = await User.findOne({email});

    if(!user){
        throw new CustomApiError.UnauthenticatedError('Verification failed!');
    }

    if(user.verificationToken !== verificationToken){
        throw new CustomApiError.UnauthenticatedError('Verification failed!!!');
    }

    user.isVerified = true,
    user.verificationDate =  Date.now(),
    user.verificationToken = ''

    await user.save();
    
    console.log(user)
    res.status(200).json({msg: 'Email verified'});
}

const login = async(req,res) =>{
    const {email,password} = req.body;

    if(!email||!password){
        throw new CustomApiError.BadRequestError('Please provide the need values');
    }

    const user = await User.findOne({email});
    
    if(!user){
        throw new CustomApiError.NotFoundError(`User doesn't exist, Please sign up`);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new CustomApiError.BadRequestError(`Invalid password, check and try again`)
    }

    if(!user.isVerified){
        throw new CustomApiError.BadRequestError(`Please verify your email`)
    }

    let refreshToken = '';

    const existingToken = await Token.findOne({user: user._id});
    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new CustomApiError.UnauthorizedError('your are temporarily restricted from this app.')
        }

        refreshToken = existingToken.refreshToken;

        const userToken = {username: user.username, email: user.email, role: user.role, userId: user._id};
        attachCookiesToResponse({res, user:userToken, refreshToken});

        res.status(StatusCodes.OK).json({success:true, user:userToken});
        return;
    }

    refreshToken = crypto.randomBytes(40).toString('hex');

    const userAgent = req.headers['user-agent']

    const userT = {refreshToken,userAgent,user:user._id};
    
    await Token.create(userT);
    
    const userToken = {username: user.username, email: user.email, role: user.role, userId: user._id};
    attachCookiesToResponse({res, user:userToken, refreshToken});

    // handleLogin(req.app.get('io'), user._id);

    res.status(StatusCodes.OK).json({success:true, user:userToken});

}

// reset password token

const forgotPassword = async(req,res) =>{
    const {email} = req.body;
  
    if(!email){
        throw new CustomApiError.BadRequestError('Please provide a valid email address');
    }
  
    const user = await User.findOne({email});

  
    if(user){
      const passwordResetToken = crypto.randomBytes(70).toString('hex');
  
      
  
        const origin = 'http://localhost:3000'
        await sendResetPasswordEmail({
            name: user.name,
            email: user.email,
            token: passwordResetToken,
            origin,
        });
  
  
      const tenMins = 1000 * 60 * 10;
      const passwordResetExpires = new Date(Date.now() + tenMins);
      
      user.passwordResetToken = createHash(passwordResetToken)
      user.passwordResetExpires = passwordResetExpires
  
      await user.save();
        // res
        //     .status(StatusCodes.BAD_REQUEST)
        //     .json({
        //         user:user,
        //         passwordResetToken
        //     });
    }
    res.status(200).json({msg: `Please check your email for rest password link`});
}

const resetPassword = async (req, res) => {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      throw new CustomApiError.BadRequestError('Please provide all values')
    }

    const user = await User.findOne({email});

    if (user) {
      const currentDate = new Date();
        
        if(user.passwordResetToken === createHash(token) && user.passwordResetExpires > currentDate) {

            user.password = password;
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save();

            res.status(200).json({msg: 'Password successfully reseted'});
        }

    
    }
  
};

const logout = async(req,res) =>{
    res.cookie('accessToken', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg:'You have successfully logged out'})
}



module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
}