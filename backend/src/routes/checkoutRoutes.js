/*
    checkoutRoutes.js

    Defines routes for book checkouts.
*/

const express = require('express');

// create mini-router for checkouts
const router = express.Router();

// register from the controller
const { checkout } = require('../controllers/checkoutController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST /api/checkout/
router.post('/', authenticateUser, authorizeRole('librarian', 'admin'), checkout);

module.exports = router;
