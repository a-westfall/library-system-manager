/*
    overdueRoutes.js

    Defines routes for overdue books.
*/

const express = require('express');

// create mini-router for overdue books
const router = express.Router();

// register from controller
const { getOverdueBooks } = require('../controllers/overdueController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// GET /api/overdue
router.get('/', authenticateUser, authorizeRole('librarian', 'admin'), getOverdueBooks);

module.exports = router;
