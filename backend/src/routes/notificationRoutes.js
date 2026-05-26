/*
    notificationRoutes.js

    Defines routes for hold notifications.
*/

const express = require('express');

// create mini-router for notifications
const router = express.Router();

// register from the controller
const { getNotifications, readNotification} = require('../controllers/notificationController');

// middleware registration
const { authenticateUser } = require('../middleware/auth');

// GET /api/notifications
router.get('/', authenticateUser, getNotifications);

// PATCH /api/notifications/notification_id #
router.patch('/:notification_id', authenticateUser, readNotification);

module.exports = router;
