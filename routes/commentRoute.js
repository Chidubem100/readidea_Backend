
const router = require('express').Router();
const {authenticate} = require('../middlewares/authenticateMiddleware');

const { createComment,
        getAllComments,
        deleteComment 
    } = require('../controllers/commentController');

router.post('/', authenticate, createComment);
router.get('/:postId', authenticate, getAllComments);
router.delete('/:commentId', authenticate, deleteComment);

module.exports = router;