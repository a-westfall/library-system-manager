/*
    pool.js

    File allows backend to connect to the database. 
*/

require('dotenv').config();

// manages class of database connections 
const { Pool } = require('pg');

// add database credentials from .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// make pool available to other files that need it
module.exports = pool;
