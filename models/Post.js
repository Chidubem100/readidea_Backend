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
        ref: 'User',
        required: true,
    },
},{
    timestamps: true, 
    toJSON: {virtuals:true}, 
    toObject: {virtuals:true}
});

PostSchema.virtual('comment',{
    ref: 'Comment',
    justOne: false,
    foreignField: 'post',
    localField: '_id'
});

// this deletes all comment associated to a post when deleted
PostSchema.pre('remove', async function(next){
    await this.model('Comment').deleteMany({post: this._id});
});

module.exports = mongoose.model('Post', PostSchema);

