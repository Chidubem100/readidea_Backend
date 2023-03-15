const fs = require('fs');
const path = require('path');
const Post  = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors/index');  


// Create a new post
const createPost = async (req, res) => {
    const { bookTitle, authorName, review} = req.body;
    
    if(!bookTitle || !authorName || !review ) {
        throw new CustomApiError.BadRequestError('Please provide the needed fields');
    }
    
    req.body.user = req.user.userId;
    const post = await Post.create(req.body)

    res.status(StatusCodes.CREATED).json({success: true, post});

}

// Get all posts
const getAllPosts = async (req, res) => {

    const {title,author, genre, category} = req.query;
    const queryObject = {};

    if(title){
        queryObject.bookTitle = {$regex: title, $options: 'i'};
        
    }
    if(author){
        queryObject.authorName = {$regex: author, $options: 'i'}
    }
    if(genre && genre !== 'all'){
        queryObject.genres = genre;
    }
    if(category && category !== 'all'){
        queryObject.bookCategory = category;
    }
    
    const result = Post.find(queryObject).sort('-createdAt');

    const posts = await result.populate({path: 'user', select:'username'});
    res.status(StatusCodes.OK).json({success: true, nbOfHits:posts.length, posts });

}

// Get single post
const getPost = async (req, res) => {
    const {
        user: { userId },
        params: { id: postId },
    } = req;
    
    const post = await Post.findOne({_id: postId, createdBy:userId}).populate({
        path: 'user', 
        select: 'username email'
    })
    .populate({
        path: 'comment'
    });

    if(!post) {    
        throw new CustomApiError.NotFoundError(`Post not found with id ${postId}`);    
    }

    res.status(StatusCodes.OK).json({success: true, post});

}


const updatePost = async (req, res) => {
    const {
        params: {id: postId},
        user: {userId}
    } = req;
    
    const post = await Post.findById({_id:postId, user:userId});
    
    if(!post){
        throw new CustomApiError.BadRequestError(`Post not found with id ${postId}`);
    }
    
    if(!post.user._id.equals(req.user.userId)){
        throw new CustomApiError.UnauthorizedError('UNAUTHORIZED');
    }

    const updatedPost = await Post.findByIdAndUpdate({_id: postId, user:userId},req.body,{
        runValidators: true,
        new: true
    });
    
    res.status(StatusCodes.OK).json({success: true, updatedPost});
}

const getUserPost = async (req, res) => {
    const {
        user: {userId}
    } = req;

    const posts = await Post.find({user:userId});
    res.status(StatusCodes.OK).json({success: true, posts});
}

const deletePost = async (req, res) => {
    
    const {
        params: {id: postId},
        user: {userId}
    } = req;

    const post = await Post.findById({_id:postId, user:userId});

    
    if(!post) {
        throw new CustomApiError.NotFoundError('Post not found with id ' + postId);
    }
    
    if(!post.user._id.equals(req.user.userId)){
        throw new CustomApiError.UnauthorizedError('UNAUTHORIZED')
    }

    await post.remove();
    res.status(StatusCodes.OK).json({success: true, message: 'Post deleted successfully'});
}

const uploadImg = async(req,res) =>{
    if(!req.files){
        throw new CustomApiError.BadRequestError('No file upload');
    }
    
    const postImg = req.files.image;

    if(!postImg.mimetype.startsWith('image')){
        throw new CustomApiError.BadRequestError('Please upload images only');
    }

    // check size of image
    const maxSize = 1024 * 1024;

    if(postImg.size > maxSize){
        throw new CustomApiError.BadRequestError('Image size should be less than 1MB')
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${postImg.name}`);
    await postImg.mv(imagePath);

    return res.status(StatusCodes.OK).json({ image:{src:`/uploads/${postImg.name}`}})
};

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    getUserPost,
    deletePost,
    uploadImg,
}

// Path: routes\api\posts.js
