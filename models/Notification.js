const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    notification: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


module.exports = mongoose.model('Notification', notificationSchema);

