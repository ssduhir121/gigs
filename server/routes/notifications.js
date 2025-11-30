// routes/notifications.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationService = require('../utils/notificationService');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const result = await NotificationService.getUserNotifications(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true'
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res, next) => {
  try {
    const result = await NotificationService.getUserNotifications(req.user.id, {
      limit: 1,
      unreadOnly: true
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount: result.unreadCount
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id, 
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res, next) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        message: 'All notifications marked as read'
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notification = await NotificationService.deleteNotification(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;