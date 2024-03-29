const router = require('express').Router(); 
const {authenticate} = require('../middlewares/authenticateMiddleware');

const {
    createPost,
    getPost,
    getAllPosts,
    updatePost,
    getUserPost,
    deletePost,
    uploadImg
} = require('../controllers/postController');

router.route('/').get(getAllPosts).post(authenticate,createPost);
router.route('/userpost').get(authenticate,getUserPost);

router.route('/:id')
    .get(authenticate,getPost)
    .patch(authenticate,updatePost)
    .delete(authenticate,deletePost)

router.route('/uploads').post(authenticate, uploadImg);    
// Upload image using Cloudinary

module.exports = router
