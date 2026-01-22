const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications created by admin
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let filter = { createdBy: req.admin._id };
    
    if (type) {
      filter.type = type;
    }
    
    if (status === 'sent') {
      filter.isSent = true;
    } else if (status === 'scheduled') {
      filter.isSent = false;
    }

    const notifications = await Notification.find(filter)
      .populate('relatedEvent', 'name eventDate')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification
// @access  Private
router.post('/', [
  body('title').trim().notEmpty().withMessage('Notification title is required'),
  body('message').trim().notEmpty().withMessage('Notification message is required'),
  body('type').isIn(['New Event', 'Event Reminder', 'Registration Closing', 'General']).withMessage('Invalid notification type'),
  body('targetAudience').isArray({ min: 1 }).withMessage('Target audience is required'),
  body('scheduledFor').optional().isISO8601().withMessage('Invalid schedule date')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, message, type, targetAudience, relatedEvent, scheduledFor } = req.body;

    // Validate related event if provided
    if (relatedEvent) {
      const event = await Event.findById(relatedEvent);
      if (!event) {
        return res.status(400).json({
          success: false,
          message: 'Related event not found'
        });
      }

      // Check if admin has access to this event
      if (event.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this event'
        });
      }
    }

    const notification = new Notification({
      title,
      message,
      type,
      targetAudience,
      relatedEvent: relatedEvent || null,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
      createdBy: req.admin._id
    });

    await notification.save();

    // If scheduled for now, mark as sent
    if (notification.scheduledFor <= new Date()) {
      notification.isSent = true;
      notification.sentAt = new Date();
      await notification.save();
    }

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating notification'
    });
  }
});

// @route   PUT /api/notifications/:id
// @desc    Update notification
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if admin has access to this notification
    if (notification.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Don't allow editing sent notifications
    if (notification.isSent) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit sent notifications'
      });
    }

    const updateData = req.body;
    
    // Validate related event if provided
    if (updateData.relatedEvent) {
      const event = await Event.findById(updateData.relatedEvent);
      if (!event) {
        return res.status(400).json({
          success: false,
          message: 'Related event not found'
        });
      }
    }

    if (updateData.scheduledFor) {
      updateData.scheduledFor = new Date(updateData.scheduledFor);
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('relatedEvent', 'name eventDate');

    res.json({
      success: true,
      message: 'Notification updated successfully',
      data: { notification: updatedNotification }
    });
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if admin has access to this notification
    if (notification.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
});

// @route   POST /api/notifications/:id/send
// @desc    Send notification immediately
// @access  Private
router.post('/:id/send', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if admin has access to this notification
    if (notification.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (notification.isSent) {
      return res.status(400).json({
        success: false,
        message: 'Notification already sent'
      });
    }

    notification.isSent = true;
    notification.sentAt = new Date();
    await notification.save();

    // TODO: Implement actual notification sending logic (email, SMS, push notification, etc.)

    res.json({
      success: true,
      message: 'Notification sent successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending notification'
    });
  }
});

module.exports = router;
