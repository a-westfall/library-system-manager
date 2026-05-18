/*
    overdueController.js

    Handles logic for overdue books.
*/

const pool = require("../db/pool");

// get information on all overdue books
const getOverdueBooks = async (req, res) => {

    // retrieve information
    try {

        const result = await pool.query(
            `SELECT users.name, books.title, books.author, books.isbn, copies.barcode, checkouts.due_date, CURRENT_DATE - due_date AS days_overdue
            FROM checkouts
            JOIN copies ON checkouts.barcode = copies.barcode
            JOIN books ON copies.isbn = books.isbn
            JOIN users ON checkouts.user_id = users.user_id
            WHERE return_date IS NULL AND due_date < CURRENT_DATE
            ORDER BY days_overdue DESC;`
        );

        // return result
        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { getOverdueBooks };
