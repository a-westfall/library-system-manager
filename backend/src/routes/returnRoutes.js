/*
    returnRoutes.js

    Defines routes for book returns.
*/

const express = require('express');

// create mini-router for returns
const router = express.Router();

// register from the controller
const { returnBook } = require('../controllers/returnController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST api/return/
router.post('/', authenticateUser, authorizeRole('librarian', 'admin'), returnBook);

module.exports = router; 
