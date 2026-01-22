const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  studentPhone: {
    type: String,
    required: true,
    trim: true
  },
  studentDepartment: {
    type: String,
    required: true,
    trim: true
  },
  studentYear: {
    type: String,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Registered', 'Confirmed', 'Cancelled'],
    default: 'Registered'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
