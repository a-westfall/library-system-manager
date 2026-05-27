/*
    cardRoutes.js

    Defines routes for card applications and reviews.
*/

const express = require('express');

// create mini-router for checkouts
const router = express.Router();

// register from the controller
const { applyForCard, reviewApplication, getPendingApplications } = require('../controllers/cardController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST /api/application
router.post('/', authenticateUser, applyForCard);

// PATCH /api/application/application_id #
router.patch('/:application_id', authenticateUser, authorizeRole('librarian', 'admin'), reviewApplication);

// GET /api/application/pending
router.get('/pending', authenticateUser, authorizeRole('librarian', 'admin'), getPendingApplications);

module.exports = router;