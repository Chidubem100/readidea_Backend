const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator') //email validator
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true,
        minLength: 2,
        maxLength: 50,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },
    password : {
        type: String,
        required: [true, "please provide password"],
        minLength: 6,
    },
    username : {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        maxLength: 50,
        minLength: 2,
    },
    profileInfo : {
        type: String,
        default: 'my profile bio',
        maxLength: [500, "Profile info should not exceed 500 characters"],
    },
    role : {
        type: String,
        default: 'user',
        required: true,
        enum: ['user', 'admin'],
    },
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    verificationToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDate: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires:{
        type: Date
    }
});


UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}

UserSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}





module.exports = mongoose.model('User', UserSchema);