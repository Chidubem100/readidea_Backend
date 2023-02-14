const Post  = require('../models/Post');
const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('../errors/index');  

// Create a new post
const createPost = async (req, res) => {
    const { bookTitle, authorName, review, bookCategory, bookImage, genres, user } = req.body;
    
    if(!bookTitle || !authorName || !bookCategory || !user) {
        throw new CustomApiError.BadRequestError('Please provide the needed values');
    }
    // Create new post
    const newPost = await Post.create({
        bookTitle,
        authorName,
        review,
        bookCategory,
        bookImage,
        genres,
        user
    });

    res.status(StatusCodes.CREATED).json({success: true, post: newPost});

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
        res.status(StatusCodes.OK).json({success: true, posts});

}

// Get single post
const getPost = async (req, res) => {
    const posts = await Post.findById(req.params.id);
    if(!posts) {    
        throw new CustomApiError.NotFoundError('Post not found');    
    }
    res.status(StatusCodes.OK).json({success: true, posts});

}

const updatePost = async (req, res) => {
    const { bookTitle, authorName, review, bookCategory, bookImage, genres, user } = req.body;
    if(!bookTitle || !authorName || !bookCategory || !user) {
        throw new CustomApiError.BadRequestError('Please provide the needed values');
    }
    const post = await Post.findById(req.params.id);
    if(!post) {
        throw new CustomApiError.NotFoundError('Post not found');
    }
    // Make sure user owns post
    if(post.user !== req.user) {
        throw new CustomApiError.UnauthorizedError('User not authorized');
    }
    post.bookTitle = req.body.bookTitle;
    post.authorName = req.body.authorName;
    post.review = req.body.review;
    post.bookCategory = req.body.bookCategory;
    post.bookImage = req.body.bookImage;
    post.genres = req.body.genres;

    const updatedPost = await post.save();
    res.status(StatusCodes.OK).json({success: true, post: updatedPost});
}

const getUserPost = async (req, res) => {
    const posts = await Post.find({user: req.params.id});
    if(!posts) {
        throw new CustomApiError.NotFoundError('Post not found');
    }
    res.status(StatusCodes.OK).json({success: true, posts});
}

const deletePost = async (req, res) => {

    const post = await Post.findById(req.params.id);
    if(!post) {
        throw new CustomApiError.NotFoundError('Post not found');
    }
    // Make sure user owns post
    if(post.user !== req.user) {
        throw new CustomApiError.UnauthorizedError('User not authorized');
    }

    await post.remove();

    res.status(StatusCodes.OK).json({success: true, message: 'Post removed'});

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
