const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    bookTitle : {
        type: String,
        required: true,
    },
    authorName : {
        type: String,
        required: true,
    },
    review : {
        type: String,
        required: true,
        maxLength: 5000,
    },
    bookCategory : {
        type: String,
        required: true,
        default: 'non-academics',
        enum: ['academics', 'non-academics'],
    },
    bookImage : {
        type: String,
    },
    genres : {
        type: String,
        enum: ['fiction', 'non-fiction', 'biography', 'poetry', 'drama', 'others'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        // type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);

