/*
    auth.js

    Defines function to authorize users before hitting the controller.
*/

const jwt = require('jsonwebtoken')

// authorize user login
const authenticateUser = async (req, res, next) => {

    // look for header
    const authToken = req.headers['authorization']

    // extract token
    const token = authToken && authToken.split(' ')[1];

    // check if token exists
    if (!token) {

        return res.status(401).json({ error: 'No token provided.' });
    }

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        // invalid token
        if (err) {

            return res.status(401).json({error: 'Invalid token.'});
        }

        // attach user infor to the request
        req.user = decoded;

        // call next function
        next();
    });
};

// authorize user role
const authorizeRole = (...roles) => {

    return (req, res, next) => {

        // check if user role meets role requirements
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        next();
    }
};

module.exports = { authenticateUser, authorizeRole};
