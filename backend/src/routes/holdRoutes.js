/*
    holdRoutes.js

    Defines routes for placing, removing, and getting holds.
*/

const express = require('express');

// create mini-router for holds
const router = express.Router();

// register from the controller
const { placeHold, cancelHold, getHolds } = require('../controllers/holdController');

// middleware registration
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// POST /api/holds/place-hold
router.post('/place-hold', authenticateUser, placeHold);

// DELETE /api/holds/cancel-hold
router.delete('/cancel-hold', authenticateUser, cancelHold);

// GET /api/holds/list
router.get('/list', authenticateUser, authorizeRole('librarian', 'admin'), getHolds);

module.exports = router;
