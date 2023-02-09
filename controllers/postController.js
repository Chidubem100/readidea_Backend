const Post  = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {

    const { bookTitle, authorName, review, bookCategory, bookImage, genres, user } = req.body;
    try {
        const newPost = new Post(req.body);

        const post = await newPost.save();
        res.json(post);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get all posts
exports.getAllPosts = async (req, res) => {
    // Queries {title, author, genre, category}
    const titleQ = req.query.bookTitle;
    const authorQ = req.query.authorName;
    const genreQ = req.query.genres;
    const categoryQ = req.query.bookCategory;
    const query = {};
    

    try {
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
        res.json(posts);
    }
    catch (err) {
        // console.error(err.message);
        res.status(500).send('Server Error');
    }
}

// Get single post
exports.getPost = async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        res.json(posts)
        
    } catch (error) {
        // console.log(error);
        res.status(500).send('Server Error')
        
    }
}

exports.updatePost = async (req, res) => {
    try {
        const posts = await Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(posts)
    }
    catch (error) {
        res.status(500).json(error)
    }
}

exports.getUserPost = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id });
        // Get total number of posts by a user
        const totalPosts = posts.length
        res.status(200).json({posts, totalPosts})
    }
    catch (error) {
        res.status(500).json(error)
    }
}

exports.deletePost = async (req, res) => {
    try {
        const posts = await Post.findByIdAndDelete(req.params.id);
        res.status(200).json(posts)
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// Path: routes\api\posts.js
