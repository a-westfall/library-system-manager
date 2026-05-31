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

            await pool.query(
                `DELETE FROM holds 
                WHERE user_id IN (
                    SELECT user_id FROM notifications 
                    WHERE message LIKE 'Your hold%' 
                    AND CURRENT_DATE - created_at::date > 7
                )`
            );

            console.log('Hold expiration job ran successfully.');

            // TODO: notify next patron their hold is ready

        } catch (err) {

            console.error('Hold expiration job failed:', err);
        }
    });
};

module.exports = { startHoldExpirationJob };