const router = require('express').Router(); 

const {
    createPost,
    getPost,
    getAllPosts,
    updatePost,
    getUserPost,
    deletePost
} = require('../controllers/postController');


router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPost);
router.patch('/:id', updatePost)
router.delete('/:id', deletePost);
router.get('/user/:id', getUserPost);

// Upload image using Cloudinary

module.exports = router
