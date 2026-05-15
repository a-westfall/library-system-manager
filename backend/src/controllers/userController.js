/*
    userController.js

    Handles logic for user registration and login.
*/

// what do these do? just makes sure the right files are used, or is it like include files in C++?
const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// POST /register
const registerUser = async (req, res) => {

    // pull fields from request body
    const {name, email, password} = req.body;

    // validate required fields
    if (!name || !email || !password) {

        // show error 400
        return res.status(400).json({error: 'Name, email, password are required fields.'});
    }

    // register user
    try {

        // check if email exists in db
        const emailExists = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );
        if (emailExists.rows.length > 0) {

            // return error 409
            return res.status(409).json({error: 'Email already registered.'});
        }

        // hash password using 10 cycles
        const passwordHash = await bcrypt.hash(password, 10);

        // insert new user
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'patron')
             RETURNING user_id, name, email, role`,
            [name, email, passwordHash]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// POST /login ?
const loginUser = async(req, res) => {

    // pull fields from request
    const {email, password} = req.body;

    // validate required fields
    if (!email || !password) {

        // show error 400
        return res.status(400).json({error: 'Email and password are required fields.'});
    }

    // login user
    try {
        
        // check if email not in db
        const result = await pool.query(
            'SELECT user_id, name, email, role, password_hash FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length == 0) {

            // return error 404
            return res.status(404).json({error: 'Email is not registered. Please create an account.'});
        }

        // compare entered and stored passwords
        const passwordMatches = await bcrypt.compare(password, result.rows[0].password_hash);

        // check if passwords match
        if (!passwordMatches) {

            // return unathorized access error code
            return res.status(401).json({error: 'Password is incorrect.'});
        }

        // return web token from successful login
        const token = jwt.sign(
            { user_id: result.rows[0].user_id, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    
    // return ok status
    const { password_hash, ...userWithoutPassword } = result.rows[0];
    res.status(200).json({ token, user: userWithoutPassword });

    } catch(err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { registerUser, loginUser };
