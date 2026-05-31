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

// import overdue routes
const overdueRoutes = require('./routes/overdueRoutes');

// import card application routes
const cardApplicationRoutes = require('./routes/cardRoutes');

// import search routes
const searchRoutes = require('./routes/searchRoutes');

// import hold routes
const holdRoutes = require('./routes/holdRoutes');

// import notification routes
const notificationRoutes = require('./routes/notificationRoutes');

// import analytics routes
const analyticsRoutes = require('./routes/analyticsRoutes');

// import catalog routes
const catalogRoutes = require('./routes/catalogRoutes');

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

// overdue routes
app.use('/api/overdue', overdueRoutes);

// card application routes
app.use('/api/application', cardApplicationRoutes);

// search routes
app.use('/api/search', searchRoutes);

// hold routes
app.use('/api/holds', holdRoutes);

// notification routes
app.use('/api/notifications', notificationRoutes);

// analytics routes
app.use('/api/analytics', analyticsRoutes);

// catalog routes
app.use('/api/catalog', catalogRoutes);

// test route
app.get('/', (req, res) => {

    res.send('Library API system is running.');
});

// start server on dedicated port
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});
