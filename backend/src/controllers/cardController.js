/*
    cardController.js

    Handles logic for library card applications.
*/

const pool = require("../db/pool");

// adds card application to card_application table
const applyForCard = async (req, res) => {

    // get required information
    const { address } = req.body;
    const userID = req.user.user_id;

    // validate required fields
    if (!address) {

        // show error 400
        return res.status(400).json({error: 'Address is a required field.'});
    }

    // insert application into database
    try {

        // check for current applications
        const existing = await pool.query(
            `SELECT application_id FROM card_applications WHERE user_id = $1 AND status IN ('pending', 'approved')`,
            [userID]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Application already exists.' });
        }

        // insert into card_applications
        const result = await pool.query(
            `INSERT INTO card_applications (user_id, address) VALUES ($1, $2) RETURNING *`,
            [userID, address]
        )

        res.status(201).json(result.rows[0]);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// review and create cards for accepted applications
const reviewApplication = async (req, res) => {

    // get required information
    const { status, denial_reason } = req.body;
    const applicationID = req.params.application_id;

    // validate required fields
    if (!status || !['approved', 'denied'].includes(status)) {
        return res.status(400).json({ error: 'Status must be approved or denied.' });
    }

    try {

        // ensure application is still pending
        const statusResult = await pool.query(
            `SELECT * FROM card_applications WHERE status = 'pending' AND application_id = $1`,
            [applicationID]
        );
        if (statusResult.rows.length === 0) {

            // return error code
            return res.status(409).json({ error: 'Application status has already been decided.' });
        }

        // begin transaction
        await pool.query(`BEGIN`);

        // application approved
        if (status === 'approved') {

            // create library card
            const app = statusResult.rows[0];
            await pool.query(
                `INSERT INTO library_cards (card_number, user_id, address) VALUES ($1, $2, $3)`,
                [`CARD-${app.application_id}`, app.user_id, app.address]
            );
        }

        // update application status
        await pool.query(
            `UPDATE card_applications SET status = $1, reviewed_by = $2, reviewed_at = CURRENT_TIMESTAMP, denial_reason = $3 WHERE application_id = $4`,
            [status, req.user.user_id, denial_reason || null, applicationID]
        );
        await pool.query(`COMMIT`);

        res.status(200).json({ message: 'Application decision successful.' });

    } catch (err) {

        // rollback database
        await pool.query(`ROLLBACK`);

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }

};

// list all pending applications
const getPendingApplications = async (req, res) => {

    // filter by status
    const status = req.query.status || 'pending';

    try {

        // get applications
        const result = await pool.query(
            `SELECT card_applications.application_id, users.name, users.email, card_applications.address, card_applications.applied_at
            FROM card_applications JOIN users on card_applications.user_id = users.user_id
            WHERE status = $1
            ORDER BY applied_at DESC`,
            [status]
        );
        
        // return result
        res.status(200).json(result.rows);

    } catch (err) {
        
        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { applyForCard, reviewApplication, getPendingApplications };
