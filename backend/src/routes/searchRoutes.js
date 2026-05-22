/*
    searchRoutes.js

    Defines routes for searching for books.
*/

const express = require('express');

// create mini-router for search
const router = express.Router();

// register from the controller
const { search } = require('../controllers/searchController');

// GET api/search
router.get('/', search);

module.exports = router;
