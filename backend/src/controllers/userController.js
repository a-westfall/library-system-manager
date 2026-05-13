/*
    userController.js

    Handles logic for user registration and login.
*/

// what do these do? just makes sure the right files are used, or is it like include files in C++?
const pool = require('../db/pool');
const bcrypt = require('bcrypt');

// POST /register
const registerUser = async (req, res) => {

    // pull fields from request body
    const {name, email, password} = req.body;

    // validate required fields
    if (!name || !email || !password) {
        // show error 400
        return res.status(400).json({error: 'Name, email, password are required fields.'});
    }

    try {

        // check if email exists in db
        const email_exists = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );
        if (email_exists.rows.length > 0) {
            // return error 409
            return res.status(409).json({error: 'Email already registered.'});
        }

        // hash password using 10 cycles
        const password_hash = await bcrypt.hash(password, 10);

        // insert new user
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'patron')
             RETURNING user_id, name, email, role`,
            [name, email, password_hash]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { registerUser };
