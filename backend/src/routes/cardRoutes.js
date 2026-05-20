/*
    cardRoutes.js

    Defines routes for card applications and reviews.
*/

const express = require('express');

// create mini-router for checkouts
const router = express.Router();

// register from the controller
const { applyForCard, reviewApplication } = require('../controllers/cardController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST /api/application
router.post('/', authenticateUser, applyForCard);

// PATCH /api/application/application_id #
router.patch('/:application_id', authenticateUser, authorizeRole('librarian', 'admin'), reviewApplication);

module.exports = router;