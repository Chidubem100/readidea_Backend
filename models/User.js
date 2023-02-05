const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator') //email validator


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
        minLength: 7,
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
    }
});

module.exports = mongoose.model('User', UserSchema);


