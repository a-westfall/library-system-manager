/*
    returnController.js

    Handles logic for returning a book.
*/

const pool = require("../db/pool");

// return function
const returnBook = async (req, res) => {

    // retrieve needed information
    const { barcode } = req.body;

    // validate barcode
    if (!barcode) {

        // return error code
        return res.status(400).json({error: 'Barcode is a required field.'});
    }


    // return book
    try {

        // find active checkout for barcode
        const checkout = await pool.query(
            `SELECT checkout_id FROM checkouts WHERE return_date IS NULL AND barcode = $1`,
            [barcode]  
        );
        if (checkout.rows.length === 0) {
            
            // return error code
            return res.status(409).json({ error: 'Book is not checked out.' });
        }

        // return transaction
        await pool.query(`BEGIN`);
        // set return date
        await pool.query(
            `UPDATE checkouts SET return_date = CURRENT_DATE WHERE barcode = $1 AND return_date IS NULL`,
            [barcode]
        );
        // update copy status
        await pool.query(
            `UPDATE copies SET status = 'available' WHERE barcode = $1`,
            [barcode]
        );
        await pool.query(`COMMIT`);

        // return success code
        res.status(200).json({ message: 'Return successful.' });

        // TODO: notify next patron in hold queue if hold exists

    } catch (err) {

        // rollback database
        await pool.query(`ROLLBACK`);

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { returnBook };
