const {attachCookiesToResponse} = require('../utils/index');
const User = require('../models/User');
const CustomApiError = require('../errors/index');
const {StatusCodes} = require('http-status-codes');


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


    const user = await User.create({email, username, password, role});

    console.log(user)
    
    const tokenUser = {username: user.username, email: user.email, role: user.role, userId: user._id};

    attachCookiesToResponse({res, user:tokenUser});

    res.status(StatusCodes.CREATED).json({success: true, user:tokenUser}); 
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

    const userToken = {username: user.username, email: user.email, role: user.role, userId: user._id};
    attachCookiesToResponse({res, user:userToken});

    res.status(StatusCodes.OK).json({success:true, user:userToken});
    
    // check if the values are provided
    // find the user with the email and check it exist
    // compare the password using the compare function created in the model
    // create usertoken and attach it to the cookies
    // send response
}

const logout = async(req,res) =>{
    res.cookie('token', 'logout',{
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({msg:'You have successfully logged out'})
}

module.exports = {
    register,
    login,
    logout,
}