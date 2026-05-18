/*
    index.js

    Entry point for backend.
*/

require('dotenv').config();

const express = require('express');

// import user routes
const userRoutes = require('./routes/userRoutes');

// import checkout routes
const checkoutRoutes = require('./routes/checkoutRoutes');

// import return routes
const returnRoutes = require('./routes/returnRoutes');

const app = express();

// port for app to run on
const PORT = process.env.PORT || 3000;

// parse incoming JSON requests
app.use(express.json());

// user routes
app.use('/api/users', userRoutes);

// checkout routes
app.use('/api/checkout', checkoutRoutes);

// return routes
app.use('/api/return', returnRoutes);

// test route
app.get('/', (req, res) => {

    res.send('Library API system is running.');
});

// start server on dedicated port
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});
