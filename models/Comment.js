const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment : {
        type: String,
        required: true,
        maxLength: 1000,
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post : {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now,
    },
},{ 
    toJSON: {virtuals:true}, 
    toObject: {virtuals:true}
});

CommentSchema.virtual('replies', {
    ref: 'Reply',
    localField: '_id',
    foreignField: 'comment',
    justOne: false,
});

CommentSchema.pre("remove", async function(next) {
    await this.model("Reply").deleteMany({ comment: this._id });
    next();
});




module.exports = mongoose.model('Comment', CommentSchema);

