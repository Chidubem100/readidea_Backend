const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplySchema = new Schema({
    reply : {
        type: String,
        required: true,
        maxLength: 100,
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment : {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Reply', ReplySchema)
