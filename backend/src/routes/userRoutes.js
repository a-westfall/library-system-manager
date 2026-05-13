/*
    userRoutes.js

    Defines routes for user registration and login.
*/

const express = require('express');

// create mini-router dedicated to users
const router = express.Router();

// register user from the controller
const { registerUser } = require('../controllers/userController');

// POST /api/users/register
router.post('/register', registerUser);

module.exports = router;
