const mongoose = require('mongoose');

// Team member sub-schema
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Team member roll number is required'],
    trim: true
  },
  department: {
    type: String,
    trim: true,
    default: ''
  },
  yearOfStudy: {
    type: String,
    enum: ['1', '2', '3', '4', ''],
    default: ''
  },
  contactNumber: {
    type: String,
    trim: true,
    default: ''
  }
}, { _id: false });

const outerCollegeRegistrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  participationType: {
    type: String,
    enum: ['solo', 'team'],
    default: 'solo'
  },
  participantName: {
    type: String,
    required: [true, 'Participant name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },
  department: {
    type: String,
    trim: true,
    default: null
  },
  yearOfStudy: {
    type: String,
    enum: ['1', '2', '3', '4', ''],
    default: ''
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: null
  },
  modeOfParticipation: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline'
  },
  teamMembers: {
    type: [teamMemberSchema],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Maximum 5 team members allowed'
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
outerCollegeRegistrationSchema.index({ eventId: 1 });
outerCollegeRegistrationSchema.index({ rollNumber: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('OuterCollegeRegistration', outerCollegeRegistrationSchema);
