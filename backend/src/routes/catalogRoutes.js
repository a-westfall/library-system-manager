/*
    catalogRoutes.js

    Defines routes for adding books and copies, and marking copies as lost.
*/

const express = require('express');

// create mini-router for the catalog
const router = express.Router();

// register from the controller
const { addBook, addCopy, markLost } = require('../controllers/catalogController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST /api/catalog/add-book
router.post('/add-book', authenticateUser, authorizeRole('librarian', 'admin'), addBook);

// POST /api/catalog/add-copy
router.post('/add-copy', authenticateUser, authorizeRole('librarian', 'admin'), addCopy);

// PATCH /api/catalog/mark-lost
router.patch('/mark-lost', authenticateUser, authorizeRole('librarian', 'admin'), markLost);

module.exports = router;
