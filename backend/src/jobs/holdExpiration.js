/*
    holdExpiration.js

    Handles logic for removing expired holds.
*/

const pool = require("../db/pool");
const cron = require('node-cron');

// remove lapsed holds every day at midnight
const startHoldExpirationJob = () => {

    cron.schedule('0 0 * * *', async () => {

        try {

            // get isbn of expiring holds
            const isbn = await pool.query(
                `SELECT isbn FROM holds WHERE user_id IN (
                    SELECT user_id FROM notifications 
                    WHERE message LIKE 'Your hold%' 
                    AND CURRENT_DATE - created_at::date > 7
                )`
            );

            // delete and notify transaction
            await pool.query(`BEGIN`);
            // notify patron(s) their hold is ready if needed
            for(const row of isbn.rows) {

                const notify = await pool.query(
                    `SELECT user_id 
                    FROM holds 
                    WHERE date_placed NOT IN (
                        SELECT user_id 
                        FROM notifications
                        WHERE message LIKE 'Your hold%' 
                        AND CURRENT_DATE - created_at::date > 7)
                    ORDER BY date_placed ASC
                    LIMIT 1`,
                    [row.isbn]
                );
                if (notify.rows.length > 0) {
                    
                    // get book title
                    const book = await pool.query(
                        `SELECT title FROM books WHERE isbn = $1`,
                        [row.isbn]
                    );  
                    // notify patron
                    await pool.query(
                        `INSERT INTO notifications (user_id, message) VALUES ($1, $2)`,
                        [notify.rows[0].user_id, `Your hold for "${book.rows[0].title}" is ready!`]
                    ); 
                }
            }
            // delete expired holds
            await pool.query(
                `DELETE FROM holds 
                WHERE user_id IN (
                    SELECT user_id FROM notifications 
                    WHERE message LIKE 'Your hold%' 
                    AND CURRENT_DATE - created_at::date > 7)`
            );
            await pool.query(`COMMIT`);

            console.log('Hold expiration job ran successfully.');

        } catch (err) {

            await pool.query(`ROLLBACK`);
            console.error('Hold expiration job failed:', err);
        }
    });
};

module.exports = { startHoldExpirationJob };