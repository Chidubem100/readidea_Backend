
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
    // Queries {title, author, genre, category}
    const titleQ = req.query.bookTitle;
    const authorQ = req.query.authorName;
    const genreQ = req.query.genres;
    const categoryQ = req.query.bookCategory;
    const query = {};
  
        if(titleQ) {
            query.$or = [
                {
                    "bookTitle" : { $regex: titleQ, $options: 'i'}
                }
            ]
        }
        if(authorQ) {
            query.$or = [
                {
                    "authorName" : { $regex: authorQ, $options: 'i'}
                }]
        }
        if(genreQ) {
            query.$or = [
                {
                    "genres" : { $regex: genreQ, $options: 'i'}
                }
            ]
        }
        if(categoryQ) {
            query.$or = [
                {
                    "bookCategory" : { $regex: categoryQ, $options: 'i'}
                }
            ]
        }

        const posts = await Post.find(query)
        res.status(StatusCodes.OK).json({success: true, nbOfHits:posts.length, posts });

}

// Get single post
const getPost = async (req, res) => {

    const {
        params: {id: postId},
        user: {userId}
    } = req

    const post = await Post.findOne({_id: postId})

    if(!post) {    
        throw new CustomApiError.NotFoundError(`Post not found with id ${postId}`);    
    }

    res.status(StatusCodes.OK).json({success: true, post});

}


const updatePost = async (req, res) => {
    const {
        params: {id: postId},
        user: {userId}
    } = req
    
    const post = await Post.findByIdAndUpdate({_id: postId,userId}, req.body,{
        new:true,
        runValidators: true
    });


    if(!post){
        throw new CustomApiError.BadRequestError(`Post not found with id ${postId}`)
    }
    
    res.status(StatusCodes.OK).json({success: true, post});
}

const getUserPost = async (req, res) => {
    const {
        params: {id: postId},
        user: {userId}
    } = req

    const posts = await Post.find({_id:postId, user:userId});
    res.status(StatusCodes.OK).json({success: true, posts});
}

const deletePost = async (req, res) => {
    const {
        params: {id: postId},
        user: {userId}
    } = req

    const post = await Post.findByIdAndDelete({_id:postId, user:userId})
    
    if(!post) {
        throw new CustomApiError.NotFoundError('Post not found with id ' + postId);
    }

    res.status(StatusCodes.OK).json({success: true, message: 'Post deleted successfully'});

}

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    getUserPost,
    deletePost
}

// Path: routes\api\posts.js
