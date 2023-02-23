const router = require('express').Router(); 
const {authenticate} = require('../middlewares/authenticateMiddleware');

const {
    createPost,
    getPost,
    getAllPosts,
    updatePost,
    getUserPost,
    deletePost
} = require('../controllers/postController');

router.route('/').get(getAllPosts).post(authenticate,createPost);
router.route('/userpost').get(authenticate,getUserPost);

router.route('/:id')
    .get(authenticate,getPost)
    .patch(authenticate,updatePost)
    .delete(authenticate,deletePost)

// Upload image using Cloudinary

module.exports = router
