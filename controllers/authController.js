const {attachCookiesToResponse,verifyToken,createJwtToken} = require('../utils/index');
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

    res.status(StatusCodes.CREATED).json({sucess: true, user:tokenUser}); 
}

const login = async(req,res) =>{
    res.send('login route')
}

const logout = async(req,res) =>{
    res.send('logout route')
}

module.exports = {
    register,
    login,
    logout,
}