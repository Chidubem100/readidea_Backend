const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
        minLength: 7,
    },
    username : {
        type: String,
        required: true,
        unique: true,
    },
    profileInfo : {
        type: String,
        default: '',
        maxLength: 500,
    },
    role : {
        type: String,
        default: 'user',
        required: true,
        enum: ['user', 'admin'],
    }
});

module.exports = mongoose.model('User', UserSchema);


