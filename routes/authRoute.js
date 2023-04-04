const express = require('express');
const router = express.Router();


const {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');



router.post('/', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);
router.get('/logout', logout);


module.exports = router;