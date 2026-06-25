/*
    catalogController.js

    Handles logic for manging library's catalog of books.
*/

const pool = require("../db/pool");

// add a new book to catalog
const addBook = async (req, res) => {

    // get required information
    const { title, isbn, author, genre, publisher, datePublished } = req.body;

    // validate information
    if (!title || !author || !isbn) {

        // return error 400 
        return res.status(400).json({error: 'Title, author, and ISBN are required fields.'});
    }

    try {

        // check if book exists
        const exists = await pool.query(
            `SELECT * FROM books WHERE isbn = $1`,
            [isbn]
        );
        if (exists.rows.length > 0) {

            return res.status(403).json({error: 'Book already exists.'});
        }

        // add book
        await pool.query(
            `INSERT INTO books (isbn, title, author, genre, publisher, date_published) VALUES ($1, $2, $3, $4, $5, $6)`,
            [isbn, title, author, genre, publisher, datePublished]
        );

        return res.status(201).json({message: 'Book added successfully.'});

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// add a copy of an existing book to catalog
const addCopy = async (req, res) => {

    // get required information
    const { barcode, isbn } = req.body;

    // validate information
    if (!barcode || !isbn) {

        return res.status(400).json({error: 'Barcode and ISBN are required fields.'});
    }

    try {

        // check if book exists
        const exists = await pool.query(
            `SELECT isbn FROM books WHERE isbn = $1`,
            [isbn]
        );
        if (exists.rows.length === 0) {
            return res.status(404).json({ error: 'Book does not exist.' });
        }

        // add copy
        await pool.query(
            `INSERT INTO copies (barcode, isbn, status) VALUES ($1, $2, 'available')`,
            [barcode, isbn]
        );

        return res.status(201).json({message: 'Copy added successfully.'});

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// update information about a book
const updateBook = async(req, res) => {

    // get required information
    const { isbn, title, genre, author, publisher, datePublished } = req.body;

    // validate information
    if (!isbn || (!title && !genre && !author && !publisher && !datePublished)) {

        return res.status(400).json({error: 'ISBN and at least one other field are required.'});
    }

    try {

        // update book based on available conditions
        await pool.query(
            `UPDATE books SET 
            title = COALESCE($1, title),
            genre = COALESCE($2, genre),
            author = COALESCE($3, author),
            publisher = COALESCE($4, publisher),
            date_published = COALESCE($5, date_published)
            WHERE isbn = $6`,
            [title, genre, author, publisher, datePublished, isbn]
        );

        return res.status(200).json({message: 'Book updated successfully.'});

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Failed to update book.'});
    }
    
};

// update information about a copy
const updateCopy = async(req, res) => {

    // get required information
    const { barcode, isbn, status } = req.body;

    // validate information
    if (!barcode || (!isbn && !status)) {

        return res.status(400).json({error: 'Barcode and at least one other field are required.'});
    }

    try {

        // update copy based on available conditions
        await pool.query(
            `UPDATE copies SET 
            isbn = COALESCE($1, isbn),
            status = COALESCE($2, status)
            WHERE barcode = $3`,
            [isbn, status, barcode]
        );

        return res.status(200).json({message: 'Copy updated successfully.'});

    } catch (err) {

        console.error(err);
        res.status(500).json({error: 'Failed to update copy.'});
    }
};

// mark a book as lost
const markLost = async (req, res) => {

    // get required information
    const { barcode } = req.body;

    // validate information
    if (!barcode) {

        return res.status(400).json({error: 'Barcode is a required field.'});
    }

    try {

        // check that copy exists
        const exists = await pool.query(
            `SELECT * FROM copies WHERE barcode = $1`,
            [barcode]
        );
        if (exists.rows.length === 0){

            return res.status(409).json({error: 'Copy does not exist.'});
        }

        // mark copy as lost
        await pool.query(
            `UPDATE copies SET status = 'lost' WHERE barcode = $1`,
            [barcode]
        );

        return res.status(200).json({message: 'Copy successfully marked as lost.'});

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { addBook, updateBook, addCopy, updateCopy, markLost};
