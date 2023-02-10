const Post  = require('../models/Post');

// Create a new post
exports.createPost = async (req, res) => {
    // Check if user is logged in
    if(!req.user) {
        return res.status(401).json({msg: 'You are not authorized to create a post'});
    }

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
        // check auth
        if(!req.user) {
            return res.status(401).json({msg: 'You are not authorized to view this post'});
        }

        res.json(posts)
        
    } catch (error) {
        // console.log(error);
        res.status(500).send('Server Error')
        
    }
}

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user');
        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }

        // Make sure user owns post
        if(post.user !== req.user) {
            // console.log(post, req.user);
            return res.status(401).json({msg: 'User not authorized'});
        }

        post.bookTitle = req.body.bookTitle;
        post.authorName = req.body.authorName;
        post.review = req.body.review;
        post.bookCategory = req.body.bookCategory;
        post.bookImage = req.body.bookImage;
        post.genres = req.body.genres;

        const updatedPost = await post.save();
        res.json(updatedPost);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}

exports.getUserPost = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id });
        // Check if user logged in
        if(!req.user) {
            return res.status(404).json({msg: 'Post not found'});
        }
        const totalPosts = posts.length
        res.status(200).json({posts, totalPosts})
    }  
    catch (error) {
            res.status(500).json(error)
        }

}

// exports.deletePost = async (req, res) => {
//     try {
//         const posts = await Post.findByIdAndDelete(req.params.id);
//         res.status(200).json(posts)
//     }
//     catch (error) {
//         res.status(500).json(error)
//     }
// }

// Path: routes\api\posts.js
