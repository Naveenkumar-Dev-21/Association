const express = require('express');
const router = express.Router();
const OuterCollegeRegistration = require('../models/OuterCollegeRegistration');
const Event = require('../models/Event');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('participantName').trim().notEmpty().withMessage('Participant name is required'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('contactNumber').trim().notEmpty().withMessage('Contact number is required')
    .isLength({ min: 10, max: 10 }).withMessage('Contact number must be 10 digits'),
  body('modeOfParticipation').optional().isIn(['Online', 'Offline']).withMessage('Invalid mode')
];

// POST /api/outer-college-registrations/:eventId - Register for an outer college event
router.post('/:eventId', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { eventId } = req.params;
    const { 
      participantName, 
      rollNumber, 
      department, 
      yearOfStudy, 
      contactNumber, 
      email,
      modeOfParticipation 
    } = req.body;

    // Check if event exists and is an outer college event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (!event.isOuterCollegeEvent) {
      return res.status(400).json({ message: 'This is not an outer college event' });
    }

    // Check for duplicate registration
    const existingRegistration = await OuterCollegeRegistration.findOne({ 
      eventId, 
      rollNumber 
    });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // Create registration
    const registration = new OuterCollegeRegistration({
      eventId,
      participantName,
      rollNumber,
      department,
      yearOfStudy,
      contactNumber,
      email,
      modeOfParticipation: modeOfParticipation || 'Offline'
    });

    await registration.save();

    res.status(201).json({
      message: 'Registration successful',
      registration
    });
  } catch (error) {
    console.error('Outer college registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// GET /api/outer-college-registrations/:eventId - Get all registrations for an event (admin)
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const registrations = await OuterCollegeRegistration.find({ eventId })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/outer-college-registrations/:registrationId/status - Update registration status
router.patch('/:registrationId/status', async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const registration = await OuterCollegeRegistration.findByIdAndUpdate(
      registrationId,
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Status updated', registration });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/outer-college-registrations/:registrationId - Delete a registration
router.delete('/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;
    
    const registration = await OuterCollegeRegistration.findByIdAndDelete(registrationId);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration deleted' });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
