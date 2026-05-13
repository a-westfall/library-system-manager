/*
    index.js

    Entry point for backend.
*/

require('dotenv').config();

const express = require('express');

const app = express();

// port for app to run on
const PORT = 3000;

// parse incoming JSON requests
app.use(express.json());

// test route
app.get('/', (req, res) => {

    res.send('Library API system is running.');
});

// start server on dedicated port
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});

// temporary db connection test
const pool = require('./db/pool');
