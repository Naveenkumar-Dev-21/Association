const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/registrations
// @desc    Get all registrations for admin's events
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { eventId, status } = req.query;
    
    // Get all events created by this admin
    const adminEvents = await Event.find({ createdBy: req.admin._id }).select('_id');
    const eventIds = adminEvents.map(event => event._id);
    
    let filter = { event: { $in: eventIds } };
    
    if (eventId) {
      filter.event = eventId;
    }
    
    if (status) {
      filter.status = status;
    }

    const registrations = await Registration.find(filter)
      .populate('event', 'name eventDate cellsAndAssociation')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      data: { registrations }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching registrations'
    });
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get registrations for a specific event
// @access  Private
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if admin has access to this event
    if (event.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      data: { registrations }
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event registrations'
    });
  }
});

// @route   POST /api/registrations
// @desc    Add new registration (for admin use)
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, studentName, studentEmail, studentPhone, studentYear } = req.body;

    // Validate event exists and admin has access
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if student is already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      studentEmail
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Student is already registered for this event'
      });
    }

    // Check if event is full
    if (event.currentRegistrations >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Create registration
    const registration = new Registration({
      event: eventId,
      studentName,
      studentEmail,
      studentPhone,
      studentYear
    });

    await registration.save();

    // Update event registration count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentRegistrations: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Registration added successfully',
      data: { registration }
    });
  } catch (error) {
    console.error('Add registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding registration'
    });
  }
});

// @route   PUT /api/registrations/:id
// @desc    Update registration status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    const registration = await Registration.findById(req.params.id).populate('event');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if admin has access to this event
    if (registration.event.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    registration.status = status;
    await registration.save();

    res.json({
      success: true,
      message: 'Registration updated successfully',
      data: { registration }
    });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating registration'
    });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Delete registration
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if admin has access to this event
    if (registration.event.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Registration.findByIdAndDelete(req.params.id);

    // Update event registration count
    await Event.findByIdAndUpdate(registration.event._id, {
      $inc: { currentRegistrations: -1 }
    });

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting registration'
    });
  }
});

module.exports = router;
