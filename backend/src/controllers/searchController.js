/*
    searchController.js

    Handles logic for searching for books.
*/

const pool = require("../db/pool");

const search = async (req, res) => {

    // get required information from URL parameters
    const title = req.query.title;
    const genre = req.query.genre;
    const author = req.query.author;
    const releaseYear = req.query.year;
    const available = req.query.available;

    // search for matching books
    try {

        const conditions = [];
        const values = [];
        let i = 1;

        // build search query based on available conditions
        if (title) {
            conditions.push(`title ILIKE $${i++}`);
            values.push(`%${title}%`);
        }
        if (author) {
            conditions.push(`author ILIKE $${i++}`);
            values.push(`%${author}%`);
        }
        if (genre) {
            conditions.push(`genre ILIKE $${i++}`);
            values.push(`%${genre}%`);
        }
        if (available === 'true') {
            conditions.push(`EXISTS (SELECT 1 FROM copies WHERE copies.isbn = books.isbn AND status = 'available')`);
        }
        if (releaseYear) {
            conditions.push(`EXTRACT(YEAR FROM date_published) = $${i++}`);
            values.push(parseInt(releaseYear));
        }

        // build where clause by joining condition statements on AND
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        // build full query by joining where clause with a select clause
        const query = `SELECT * FROM books ${whereClause}`;
        // run query with values
        const result = await pool.query(query, values);

        // return result
        res.status(200).json(result.rows);

    } catch(err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { search };
