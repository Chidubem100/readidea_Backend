const Notification = require('../models/Notification');
const { StatusCodes } = require('http-status-codes');

// unread notifications
const unreadNotifications = async (userId) => {};

// read notifications
const readNotifications = async (userId) => {};

// delete notification
const deleteNotification = async (userId, notificationId) => {};

module.exports = {
    unreadNotifications,
    readNotifications,
    deleteNotification
};