/*
    checkoutController.js

    Handles logic for checking out books.
*/

const pool = require("../db/pool");

const checkout = async (req, res) => {

    // get required information
    const { employeeID, userID, cardNumber, barcode} = req.body;

    // validate required fields
    if (!employeeID || !userID || !cardNumber || !barcode) {

        // show error 400
        return res.status(400).json({error: 'Employee ID, library card number, and barcode are required fields.'});
    }

    // validation and checkout transaction
    try {

        // validate library card
        const validateCard = await pool.query(
            `SELECT card_number FROM library_cards WHERE card_number = $1 AND user_id = $2 AND active = true`,
            [cardNumber, userID]
        );
        if (validateCard.rows.length == 0) {

            // return error 404
            return res.status(404).json({error: 'Invalid library card.'});
        }

        // verify user is below checkout limit
        const checkouts = await pool.query(
            `SELECT COUNT(*) FROM checkouts WHERE user_id = $1 AND return_date is NULL`,
            [userID]
        );
        if (parseInt(checkouts.rows[0].count) >= 5) {
            
            // return error code
            return res.status(403).json({error: 'Cannot have more than 5 books checked out at once.'});
        }

        // verify user has no overdue books
        const overdue = await pool.query(
            `SELECT user_id FROM checkouts WHERE user_id = $1 AND return_date IS NULL AND due_date < CURRENT_DATE`,
            [userID]
        );
        if (overdue.rows.length > 0) {

            // return error code
            return res.status(403).json({ error: 'Cannot check out books with overdue items.' });
        }

        // verify copy exists and is available
        const copy = await pool.query(
        `SELECT barcode FROM copies WHERE barcode = $1 AND status = 'available'`,
        [barcode]
    );
    if (copy.rows.length === 0) {

        // return error code
        return res.status(409).json({ error: 'Book is not available for checkout.' });
    }

    // checkout transaction
    await pool.query(`BEGIN`);
    // insert into checkouts
    await pool.query(
        `INSERT INTO checkouts (user_id, barcode, checkout_date, due_date) VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + 21)`,
        [userID, barcode]
    );
    // update copy status
    await pool.query(
        `UPDATE copies SET status = 'checked_out' WHERE barcode = $1`,
        [barcode]
    );
    // delete copy hold if it exists
    await pool.query(
        `DELETE FROM holds WHERE user_id = $1 AND isbn = (SELECT isbn FROM copies WHERE barcode = $2)`,
        [userID, barcode]
    );
    await pool.query(`COMMIT`);

    res.status(201).json({ message: 'Checkout successful.' });
    
    } catch (err) {

        // rollback database
        await pool.query(`ROLLBACK`);

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { checkout };
