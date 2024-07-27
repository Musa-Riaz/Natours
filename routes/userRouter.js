const express = require('express');
const router = express.Router();
const fs = require('fs');
const authController = require('./../controllers/authController');

router
.get('/get-users', authController.getAllUsers)

router
.post('/signup', authController.signUp);

router
.post('/login', authController.login);


router
.post('/forgotPassword', authController.forgotPassword)

router
.patch('/resetPassword/:token', authController.resetPassword)


module.exports = router;