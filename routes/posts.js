const router = require('express').Router(); 
const postController = require('../controllers/postController');

// Create post
router.post('/', postController.createPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Get single post
router.get('/:id', postController.getPost);

// Update post
router.patch('/:id', postController.updatePost)

// Delete post
router.delete('/:id', postController.deletePost);

// Get user post
router.get('/user/:id', postController.getUserPost);

// Upload image using Cloudinary

module.exports = router
