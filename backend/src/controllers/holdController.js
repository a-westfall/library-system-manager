/*
    holdController.js

    Handles logic for placing holds.
*/

const pool = require("../db/pool");

// place a hold for a book
const placeHold = async (req, res) => {

    // get required information
    const { isbn } = req.body;
    const userID = req.user.user_id;

    // validate required information
    if (!isbn) {

        // return error 400
        return res.status(400).json({error: 'ISBN is a required field.'});
    }

    // place hold
    try {

        // validate isbn
        const isbnResult = await pool.query(
            `SELECT * FROM books WHERE isbn = $1`,
            [isbn]
        );
        if (isbnResult.rows.length === 0) {

            return res.status(409).json({error: 'Book does not exist.'});
        }

        // check if patron has overdue books
        const hasOverdueBooks = await pool.query(
            `SELECT * FROM checkouts WHERE user_id = $1 AND due_date < CURRENT_DATE AND return_date IS NULL`,
            [userID]
        );
        if (hasOverdueBooks.rows.length > 0) {

            return res.status(403).json({error: 'User has overdue books.'});
        }

        // check if book is currently available
        const isAvailable = await pool.query(
            `SELECT * FROM copies WHERE isbn = $1 AND status = 'available'`,
            [isbn]
        );
        if (isAvailable.rows.length > 0) {

            return res.status(409).json({error: 'Book is currently available.'});
        }

        // check if patron already has book checked out
        const checkedOut = await pool.query(
            `SELECT * FROM copies JOIN checkouts ON copies.barcode = checkouts.barcode WHERE isbn = $1 AND user_id = $2 AND return_date IS NULL`,
            [isbn, userID]
        );
        if (checkedOut.rows.length > 0) {

            return res.status(409).json({error: 'User already has book checked out.'});
        }

        // check if patron already placed hold on book
        const holdPlaced = await pool.query(
            `SELECT * FROM holds WHERE isbn = $1 AND user_id = $2`,
            [isbn, userID]
        );
        if (holdPlaced.rows.length > 0) {

            return res.status(409).json({error: 'User already has hold placed on this book.'});
        }

        // place hold
        await pool.query(
            `INSERT into holds (isbn, user_id) VALUES ($1, $2)`,
            [isbn, userID]  
        );

        res.status(201).json({ message: 'Hold placed successfully.' });
        
    } catch (err) {
        
        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// cancel a hold
const cancelHold = async (req, res) => {

    // get required information
    const { isbn } = req.body;
    const userID = req.user.user_id;

    // validate information
    if (!isbn) {

        return res.status(400).json({error: 'ISBN is a required field.'});
    }

    // validate and remove hold
    try {

        // make sure there is a hold
        const exists = await pool.query(
            `SELECT * FROM holds WHERE user_id = $1 AND isbn = $2`,
            [userID, isbn]
        );
        if (exists.rows.length === 0) {
            
            return res.status(409).json({error: 'No hold placed on this book.'});
        }

        // remove hold
        await pool.query(
            `DELETE FROM holds WHERE user_id = $1 AND isbn = $2`,
            [userID, isbn]
        );

        res.status(200).json({ message: 'Hold removed successfully.' });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// return all holds
const getHolds = async (req, res) => {

    try {

        // get holds
        const result = await pool.query(
            `SELECT holds.hold_id, users.name, books.title, books.isbn, holds.date_placed
            FROM holds
            JOIN users ON holds.user_id = users.user_id
            JOIN books ON holds.isbn = books.isbn
            ORDER BY holds.date_placed ASC`
        );

        // return result
        res.status(200).json(result.rows);

    } catch (err) {
        
        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { placeHold, cancelHold, getHolds };
