/*
    notificationController.js

    Handles logic for hold notifications.
*/

const pool = require("../db/pool");

// list all notifications for a user
const getNotifications = async (req, res) => {

    // get required information
    const userID = req.user.user_id;

    try {

        // get all notifications
        const result = await pool.query(
            `SELECT message, is_read, created_at FROM notifications WHERE user_id = $1`,
            [userID]
        );

        // return result
        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

// mark notification as read
const readNotification = async (req, res) => {

    // get required information
    const notificationID = req.params.notification_id;

    try {

        // mark notification as read
        await pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1 AND user_id = $2`,
            [notificationID, req.user.user_id]
        );

        res.status(200).json({message: 'Notification successfully marked as read.'});

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Server error.'});
    }
};

module.exports = { getNotifications, readNotification };
