/*
    catalogRoutes.js

    Defines routes for adding books and copies, and marking copies as lost.
*/

const express = require('express');

// create mini-router for the catalog
const router = express.Router();

// register from the controller
const { addBook, updateBook, addCopy, updateCopy, markLost } = require('../controllers/catalogController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST /api/catalog/add-book
router.post('/add-book', authenticateUser, authorizeRole('librarian', 'admin'), addBook);

// PATCH /api/catalog/update-book
router.patch('/update-book', authenticateUser, authorizeRole('librarian', 'admin'), updateBook);

// POST /api/catalog/add-copy
router.post('/add-copy', authenticateUser, authorizeRole('librarian', 'admin'), addCopy);

// PATCH /api/catalog/update-copy
router.patch('/update-copy', authenticateUser, authorizeRole('librarian', 'admin'), updateCopy);

// PATCH /api/catalog/mark-lost
router.patch('/mark-lost', authenticateUser, authorizeRole('librarian', 'admin'), markLost);

module.exports = router;
