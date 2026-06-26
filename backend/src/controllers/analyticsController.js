/*
    analyticsController.js

    Handles logic for library analytics, including:
    - Inventory breakdown
    - Checkouts per month
*/

const pool = require("../db/pool");

// get the amount of copies in each status
const getInventoryStatus = async (req, res) => {

    try {

        // get books in each status
        const result = await pool.query(
            `SELECT status, COUNT(*) AS total_copies
            FROM copies
            GROUP BY status`
        );

        // return result
        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// get amount of books that are overdue, and percentage that are overdue
const getOverdueStats = async (req, res) => {

    try {

        // get overdue count
        const overdue = await pool.query(
            `SELECT COUNT(*) AS total_overdue
            FROM checkouts
            WHERE due_date < CURRENT_DATE AND return_date IS NULL`
        );

        // get total books checked out
        const checkedOut = await pool.query(
            `SELECT COUNT(*) AS total_checked_out
            FROM copies
            WHERE status = 'checked_out'`
        );

        // get totals and calculate percentage
        const totalOverdue = parseInt(overdue.rows[0].total_overdue);
        const totalCheckedOut = parseInt(checkedOut.rows[0].total_checked_out);
        const percentage = totalCheckedOut > 0 
        ? ((totalOverdue / totalCheckedOut) * 100).toFixed(2) 
        : 0;

        // return result
        res.status(200).json({
            total_overdue: totalOverdue,
            total_checked_out: totalCheckedOut,
            overdue_percentage: percentage
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// get number of books checked out each month
const getCheckoutsPerMonth = async (req, res) => {

    try {

        // get books checked out per month
        const result = await pool.query(
            `SELECT DATE_TRUNC('month', checkout_date) AS month_checked_out, COUNT(*) AS total_checked_out
            FROM checkouts
            GROUP BY month_checked_out
            ORDER BY month_checked_out`
        );

        // return result
        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// get most popular books
const getPopularBooks = async (req, res) => {

    try {

        // get 10 most popular books
        const result = await pool.query(
            `SELECT COUNT(*) AS times_checked_out, books.isbn, books.author, books.title, books.genre
            FROM checkouts 
            JOIN copies ON checkouts.barcode = copies.barcode
            JOIN books ON copies.isbn = books.isbn
            GROUP BY books.isbn, books.author, books.title, books.genre
            ORDER BY times_checked_out DESC
            LIMIT 10`
        );

        return res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// get reasons why applications were denied
const getDenialAnalytics = async (req, res) => {

    try {

        // get denial reasons grouped by reason
        const result = await pool.query(
            `SELECT denial_reason, COUNT(*) AS total
            FROM card_applications
            WHERE status = 'denied'
            GROUP BY denial_reason
            ORDER BY total DESC`
        );

        return res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// get rate of approved applications
const getApprovalRate = async (req, res) => {

    try {

        // get percentage of applications that were approved by month
        const result = await pool.query(
            `SELECT DATE_TRUNC('month', reviewed_at) AS month_reviewed,
            (COUNT(*) FILTER (WHERE status = 'approved'))::float / 
            NULLIF(COUNT(*), 0) * 100 as approval_rate
            FROM card_applications
            WHERE status IN ('approved', 'denied')
            GROUP BY month_reviewed
            ORDER BY month_reviewed`
        );

        return res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({error: 'Server error.'});
    }
};

module.exports = { getInventoryStatus, getCheckoutsPerMonth, getOverdueStats, getPopularBooks, 
                   getDenialAnalytics, getApprovalRate };
