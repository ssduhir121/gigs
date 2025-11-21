// utils/notificationService.js
const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(notificationData) {
    try {
      const notification = await Notification.create(notificationData);
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Notify when a new gig is created (for admin)
   */
  static async notifyGigCreated(gig, creator) {
    try {
      // Find admin users
      const User = require('../models/User');
      const admins = await User.find({ role: 'admin' }).select('_id');
      
      const notifications = admins.map(admin => ({
        userId: admin._id,
        type: 'gig_created',
        title: 'New Gig Created',
        message: `User ${creator.name} created a new gig: "${gig.title}"`,
        data: {
          gigId: gig._id,
          amount: gig.budget,
          metadata: {
            creatorName: creator.name,
            creatorEmail: creator.email,
            contentType: gig.contentType
          }
        },
        priority: 'medium'
      }));

      await Notification.insertMany(notifications);
      console.log(`📢 Notified ${admins.length} admin(s) about new gig`);
    } catch (error) {
      console.error('Error in notifyGigCreated:', error);
    }
  }

  /**
   * Notify when a submission is received (for gig owner)
   */
  static async notifySubmissionReceived(share, gig, sharer) {
    try {
      const notification = await this.createNotification({
        userId: gig.user,
        type: 'submission_received',
        title: 'New Submission Received',
        message: `User ${sharer.name} submitted proof for your gig: "${gig.title}"`,
        data: {
          gigId: gig._id,
          shareId: share._id,
          metadata: {
            sharerName: sharer.name,
            contentType: gig.contentType
          }
        },
        priority: 'high'
      });

      console.log(`📢 Notified gig owner about new submission`);
      return notification;
    } catch (error) {
      console.error('Error in notifySubmissionReceived:', error);
    }
  }

  /**
   * Notify when submission is approved (for sharer)
   */
  static async notifySubmissionApproved(share, gig, amount) {
    try {
      const notification = await this.createNotification({
        userId: share.user,
        type: 'submission_approved',
        title: 'Submission Approved!',
        message: `Your submission for "${gig.title}" was approved. You earned $${amount.toFixed(2)}!`,
        data: {
          gigId: gig._id,
          shareId: share._id,
          amount: amount,
          metadata: {
            gigTitle: gig.title
          }
        },
        priority: 'high'
      });

      console.log(`📢 Notified sharer about approved submission`);
      return notification;
    } catch (error) {
      console.error('Error in notifySubmissionApproved:', error);
    }
  }

  /**
   * Notify when submission is rejected (for sharer)
   */
  static async notifySubmissionRejected(share, gig, reason) {
    try {
      const notification = await this.createNotification({
        userId: share.user,
        type: 'submission_rejected',
        title: 'Submission Rejected',
        message: `Your submission for "${gig.title}" was rejected.${reason ? ` Reason: ${reason}` : ''}`,
        data: {
          gigId: gig._id,
          shareId: share._id,
          reason: reason,
          metadata: {
            gigTitle: gig.title
          }
        },
        priority: 'medium'
      });

      console.log(`📢 Notified sharer about rejected submission`);
      return notification;
    } catch (error) {
      console.error('Error in notifySubmissionRejected:', error);
    }
  }

  /**
   * Notify when withdrawal is requested (for admin)
   */
  static async notifyWithdrawalRequested(withdrawal, user) {
    try {
      const User = require('../models/User');
      const admins = await User.find({ role: 'admin' }).select('_id');
      
      const notifications = admins.map(admin => ({
        userId: admin._id,
        type: 'withdrawal_requested',
        title: 'Withdrawal Request',
        message: `User ${user.name} requested a withdrawal of $${withdrawal.amount}`,
        data: {
          withdrawalId: withdrawal._id,
          amount: withdrawal.amount,
          metadata: {
            userName: user.name,
            userEmail: user.email,
            paymentMethod: withdrawal.paymentMethod
          }
        },
        priority: 'medium'
      }));

      await Notification.insertMany(notifications);
      console.log(`📢 Notified ${admins.length} admin(s) about withdrawal request`);
    } catch (error) {
      console.error('Error in notifyWithdrawalRequested:', error);
    }
  }

  /**
   * Notify when withdrawal is processed (for user)
   */
  static async notifyWithdrawalProcessed(withdrawal, user) {
    try {
      const notification = await this.createNotification({
        userId: withdrawal.user,
        type: withdrawal.status === 'completed' ? 'withdrawal_processed' : 'withdrawal_failed',
        title: withdrawal.status === 'completed' ? 'Withdrawal Processed' : 'Withdrawal Failed',
        message: withdrawal.status === 'completed' 
          ? `Your withdrawal of $${withdrawal.amount} has been processed successfully.`
          : `Your withdrawal of $${withdrawal.amount} failed. ${withdrawal.failureReason || 'Please try again.'}`,
        data: {
          withdrawalId: withdrawal._id,
          amount: withdrawal.amount,
          status: withdrawal.status,
          reason: withdrawal.failureReason,
          metadata: {
            paymentMethod: withdrawal.paymentMethod
          }
        },
        priority: withdrawal.status === 'completed' ? 'medium' : 'high'
      });

      console.log(`📢 Notified user about withdrawal ${withdrawal.status}`);
      return notification;
    } catch (error) {
      console.error('Error in notifyWithdrawalProcessed:', error);
    }
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(userId, options = {}) {
    try {
      const { limit = 20, page = 1, unreadOnly = false } = options;
      const skip = (page - 1) * limit;

      const query = { userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ 
        userId, 
        isRead: false 
      });

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
      });
      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;