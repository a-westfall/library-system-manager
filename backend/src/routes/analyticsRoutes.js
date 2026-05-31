/*
    analyticsRoutes.js

    Defines routes for getting book analytics.
*/

const express = require('express');

// create mini-router for analytics
const router = express.Router();

// register from the controller
const { getInventoryStatus, getCheckoutsPerMonth, getOverdueStats, getPopularBooks } = require('../controllers/analyticsController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// GET /api/analytics/inventory
router.get('/inventory', authenticateUser, authorizeRole('librarian', 'admin'), getInventoryStatus);

// GET /api/analytics/overdue
router.get('/overdue', authenticateUser, authorizeRole('librarian', 'admin'), getOverdueStats);

// GET /api/analytics/checkouts
router.get('/checkouts', authenticateUser, authorizeRole('librarian', 'admin'), getCheckoutsPerMonth);

// GET /api/analytics/popular-books
router.get('/popular-books', authenticateUser, authorizeRole('librarian', 'admin'), getPopularBooks);

module.exports = router;