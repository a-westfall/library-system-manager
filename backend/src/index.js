/*
    index.js

    Entry point for backend.
*/

require('dotenv').config();

const express = require('express');

// import user routes
const userRoutes = require('./routes/userRoutes');

const app = express();

// port for app to run on
const PORT = process.env.PORT || 3000;

// parse incoming JSON requests
app.use(express.json());

// user routes
app.use('/api/users', userRoutes);

// test route
app.get('/', (req, res) => {

    res.send('Library API system is running.');
});

// start server on dedicated port
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});
