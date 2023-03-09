
const express = require('express');
const router = express.Router();
const {authenticate, authorizeUser} = require('../middlewares/authenticateMiddleware');

const {
    getAllUsers, //get
    getSingleUser, // get
    updateProfile, // patch
    showCurrentUser, //get
    changePassword //patch
} = require('../controllers/userController');


router
    .route('/')
    .get(authenticate,authorizeUser('admin'),getAllUsers);


router
    .route('/showme')
    .get(authenticate,showCurrentUser);
router
    .route('/updateProfile')
    .patch(authenticate,updateProfile);
router
    .route('/changePassword')
    .patch(authenticate,changePassword);

router
    .route('/profile/:id')
    .get(authenticate,getSingleUser)


module.exports = router;