const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() { return !this.isOuterCollegeEvent; },
    trim: true,
    default: 'Outer College Event'
  },
  organizingBody: {
    type: String,
    required: function() { return !this.isOuterCollegeEvent; },
    trim: true,
    default: 'External'
  },
  eventType: {
    type: [String],
    enum: ['Hackathon', 'Workshop', 'Inter College', 'Intra College', 'Fun Event'],
    default: ['Inter College']
  },
  registrationMode: {
    type: String,
    enum: ['Platform', 'Google Forms', 'Outer College'],
    default: 'Platform'
  },
  isOuterCollegeEvent: {
    type: Boolean,
    default: false
  },
  hostCollegeName: {
    type: String,
    default: null,
    trim: true
  },
  externalEventLink: {
    type: String,
    default: null
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline'
  },
  eventDate: {
    type: Date,
    default: Date.now
  },
  registrationEndDate: {
    type: String,
    default: null
  },
  venue: {
    type: String,
    required: function() {
      return this.mode === 'Offline' && !this.isOuterCollegeEvent;
    },
    trim: true,
    default: 'See poster for details'
  },
  eventCoordinator: {
    name: {
      type: String,
      required: function() { return !this.isOuterCollegeEvent; },
      trim: true,
      default: 'TBD'
    },
    contact: {
      type: String,
      required: function() { return !this.isOuterCollegeEvent; },
      trim: true,
      default: 'N/A'
    }
  },
  cellsAndAssociation: {
    type: String,
    enum: ['IT', 'IIC', 'EMDC'],
    default: 'IT'
  },
  posterImage: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: 'See poster for details'
  },
  rules: {
    type: String,
    default: 'See poster for details'
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
    default: '#'
  },
  maxParticipants: {
    type: Number,
    default: 100,
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
eventSchema.index({ cellsAndAssociation: 1, status: 1 });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Event', eventSchema);
