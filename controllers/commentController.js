
const Comment = require('../models/Comment');
const Reply = require('../models/reply');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors/index');
const { checkPermission } = require('../utils');


const createComment = async (req, res) => {
    const {
        user: {userId},
        body: {comment, postId}
    } = req;
    
    if(!comment || !postId) {
        throw new CustomApiError.BadRequestError('Please provide the needed fields');
    }
    if(comment.length > 1000) {
        throw new CustomApiError.BadRequestError('Comment is too long');
    }
    const newComment = await Comment.create({
        user: userId,
        post: postId,
        comment
    });
    res.status(StatusCodes.CREATED).json({success: true, newComment});
}
const getAllComments = async (req, res) => {
    const { postId } = req.params;
    const getComments = await Comment.find({post: postId});
    if(getComments.length === 0) {
        throw new CustomApiError.NotFoundError(`No comments found for post ${postId}`);
    }
    res.status(StatusCodes.OK).json({success: true, getComments});
}

const getSingleComment = async (req, res) => {
    const { commentId } = req.params;

    const getComment = await Comment.findById(commentId).populate({
        path: 'user', 
        select: 'username'
    })
    .populate({
        path: 'post replies',
    })

    if(!getComment) {
        throw new CustomApiError.NotFoundError(`No comment found for id ${commentId}`);
    }

    res.status(StatusCodes.OK).json({success: true, getComment});
}

const deleteComment = async (req, res) => {
    const {
        params: { commentId },
        user: { userId }
    } = req;

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new CustomApiError.NotFoundError(`No comment found for id ${commentId}`);
    }
    if(!comment.user._id.equals(userId)){
        throw new CustomApiError.UnauthorizedError('You are not authorized to delete this comment');
    }

    
    await comment.remove();
    res.status(StatusCodes.OK).json({success: true, message: 'Comment deleted'});

}

const addReply = async (req, res) => {
    const {
        user: { userId },
        body: { reply, commentId },
    } = req;

    if(!reply) {
        throw new CustomApiError.BadRequestError('Please provide the needed fields');
    }
    if(reply.length > 1000) {
        throw new CustomApiError.BadRequestError('Reply is too long');
    }

    const newReply = await Reply.create({
        reply,
        user: userId,
        comment: commentId
    });

    res.status(StatusCodes.CREATED).json({success: true, newReply});

}

const deleteReply = async (req, res) => {
    const {
        params: { replyId },
        user : { userId }
    } = req;

    const reply = Reply.findById(replyId);
    if(!reply) {
        throw new CustomApiError.NotFoundError(`No reply found for id ${replyId}`);
    }
    if(!reply.user._id.equals(userId)){
        throw new CustomApiError.UnauthorizedError('You are not authorized to delete this reply');
    }

    await reply.remove();
    res.status(StatusCodes.OK).json({success: true, message: 'Reply deleted'});
}








module.exports = {
    createComment,
    getAllComments,
    getSingleComment,
    deleteComment,
    addReply,
    deleteReply
}