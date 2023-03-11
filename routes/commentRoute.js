
const router = require('express').Router();
const {authenticate} = require('../middlewares/authenticateMiddleware');

const { createComment,
        getSingleComment,
        getAllComments,
        deleteComment 
    } = require('../controllers/commentController');

router.post('/', authenticate, createComment);
router.get('/:postId', authenticate, getAllComments);
router.get('/single/:commentId', authenticate, getSingleComment);
router.delete('/:commentId', authenticate, deleteComment);


module.exports = router;