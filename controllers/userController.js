const User = require('../models/User');
const {attachCookiesToResponse,
        sendEmail} = require('../utils');
const {StatusCodes} = require('http-status-codes');
const CustomApiError = require('../errors');
const crypto = require('crypto');

// getAllUsers
const getAllUsers = async(req,res) =>{
    const user = await User.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({success:true, user});
};

// getSingleUser
const getSingleUser = async(req,res) =>{
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if(!user){
        throw new CustomApiError.BadRequestError('No user with id ' + req.params.id);
    }
    res.status(StatusCodes.OK).json({success:true, user});
};

// updateProfile
const updateProfile = async(req,res) =>{
    const {email,username,profileInfo} = req.body;

    if(!email || !username){
        throw new CustomApiError.BadRequestError(`Please provide the needed values`)
    }

    const isEmailAlreadyExist = await User.findOne({email});
    if(isEmailAlreadyExist){
        throw new CustomApiError.BadRequestError('Email already linked to an account')
    }

    const usernameExists = await User.findOne({username});
    if(usernameExists){
        throw new CustomApiError.BadRequestError('Username already taken, choose another username')
    }

    const user = await User.findOne({_id: req.user.userId});
    user.email = email;
    user.username = username;
    user.profileInfo = profileInfo;

    await user.save()

    const tokenUser = {username: user.username, email: user.email, profileInfo :user.profileInfo,role: user.role, userId: user._id};
    
    attachCookiesToResponse({res, user:tokenUser});
    res.status(StatusCodes.OK).json({success:true, user:tokenUser});
};

// changePassword
const changePassword = async(req,res) =>{
    const {newPassword,oldPassword} = req.body;

    if(!newPassword || !oldPassword){
        throw new CustomApiError.BadRequestError('Please provide credentials')
    }

    const user = await User.findOne({_id: req.user.userId});

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomApiError.BadRequestError(`Please provide the correct credentials`)
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({msg: 'Password updated successfully'});
};

// showCurrentUser
const showCurrentUser = async(req,res) =>{
    res.status(StatusCodes.OK).json({ user:req.user })
};

// reset password token
const token = async(req,res) =>{
    const {email} = req.body;
    if(!email){
        throw new CustomApiError.BadRequestError('Please provide the needed values')
    }

    const user = await User.findOne({email});

    if(!user){
        throw new CustomApiError.BadRequestError('No user with email ' + email);
    }

    const token = await user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${token}`;

    const message = {
        to: user.email,
        subject: 'Password reset token',
        html: `<p>Please click on the link below to reset your password</p> <a href="${resetUrl}">Reset Password</a>`
    }

    await sendEmail(message);

    res.status(StatusCodes.OK).json({msg: 'Token sent to ' + user.email, token});
};

// reset password
const resetPassword = async(req,res) =>{
    const {
        body: { password },
        params: { token },
    } = req;

    if(!password){
        throw new CustomApiError.BadRequestError('Please provide the needed values')
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user){
        throw new CustomApiError.BadRequestError('Token is invalid or has expired')
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({msg: 'Password updated successfully'});
};







module.exports = {
    getAllUsers,
    getSingleUser,
    updateProfile,
    changePassword,
    showCurrentUser,
    token,
    resetPassword
};