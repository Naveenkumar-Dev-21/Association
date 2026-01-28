const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['New Event', 'Event Reminder', 'Registration Closing', 'General'],
    required: [true, 'Notification type is required']
  },
  targetAudience: {
    type: [String],
    enum: ['All Students', 'IT Department', 'IIC Department', 'EMDC Department'],
    required: [true, 'Target audience is required']
  },
  relatedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  isSent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  cellsAndAssociation: {
    type: String,
    enum: ['IT', 'IIC', 'EMDC', 'OT'],
    required: [true, 'Cells and Association is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
