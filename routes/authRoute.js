const express = require('express');
const router = express.Router();


const {
    register,
    login,
    logout,
    verifyEmail
} = require('../controllers/authController');



router.post('/', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/logout', logout);


module.exports = router;