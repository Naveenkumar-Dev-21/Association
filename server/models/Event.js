const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  organizingBody: {
    type: String,
    required: [true, 'Organizing body is required'],
    trim: true
  },
  eventType: {
    type: [String],
    enum: ['Hackathon', 'Workshop', 'Inter College', 'Intra College', 'Fun Event'],
    required: [true, 'Event type is required']
  },
  registrationMode: {
    type: String,
    enum: ['Platform', 'Google Forms'],
    required: [true, 'Registration mode is required']
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: [true, 'Event mode is required']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  venue: {
    type: String,
    required: function() {
      return this.mode === 'Offline';
    },
    trim: true
  },
  eventCoordinator: {
    name: {
      type: String,
      required: [true, 'Coordinator name is required'],
      trim: true
    },
    contact: {
      type: String,
      required: [true, 'Coordinator contact is required'],
      trim: true
    }
  },
  department: {
    type: String,
    enum: ['IT', 'IIC', 'EMDC'],
    required: [true, 'Department is required']
  },
  posterImage: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  rules: {
    type: String,
    required: [true, 'Rules are required']
  },
  eventLink: {
    type: String,
    default: null
  },
  brochure: {
    type: String,
    default: null
  },
  whatsappGroupLink: {
    type: String,
    default: null
  },
  registrationLink: {
    type: String,
    required: [true, 'Registration link is required']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Maximum participants is required'],
    min: [1, 'Maximum participants must be at least 1']
  },
  currentRegistrations: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ department: 1, status: 1 });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Event', eventSchema);
