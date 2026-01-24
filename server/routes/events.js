const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'posterImage') {
      cb(null, 'uploads/posters/');
    } else if (file.fieldname === 'brochure') {
      cb(null, 'uploads/brochures/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'posterImage') {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for poster!'));
      }
    } else if (file.fieldname === 'brochure') {
      const allowedTypes = /jpeg|jpg|png|pdf/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only PDF and image files are allowed for brochure!'));
      }
    } else {
      cb(null, true);
    }
  }
});

// @route   GET /api/events
// @desc    Get all events for a cells and association
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { cellsAndAssociation, status } = req.query;
    let filter = {};
    
    // If not OT, restrict to their own association
    if (req.admin.cellsAndAssociation !== 'OT') {
      filter.cellsAndAssociation = req.admin.cellsAndAssociation;
    } else if (cellsAndAssociation && cellsAndAssociation !== 'ALL') {
      // OT can filter by specific association
      filter.cellsAndAssociation = cellsAndAssociation;
    }
    
    if (status) {
      filter.status = status;
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if admin has access to this event
    if (event.createdBy._id.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private
router.post('/', auth, upload.fields([
  { name: 'posterImage', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]), [
  body('name').trim().notEmpty().withMessage('Event name is required'),
  body('organizingBody').trim().notEmpty().withMessage('Organizing body is required'),
  body('eventType').isArray({ min: 1 }).withMessage('Event type is required'),
  body('registrationMode').isIn(['Platform', 'Google Forms']).withMessage('Invalid registration mode'),
  body('mode').isIn(['Online', 'Offline']).withMessage('Invalid mode'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('venue').if(body('mode').equals('Offline')).notEmpty().withMessage('Venue is required for offline events'),
  body('eventCoordinator.name').trim().notEmpty().withMessage('Coordinator name is required'),
  body('eventCoordinator.contact').trim().notEmpty().withMessage('Coordinator contact is required'),
  body('cellsAndAssociation').isIn(['IT', 'IIC', 'EMDC']).withMessage('Invalid Cells and Association'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('rules').trim().notEmpty().withMessage('Rules are required'),
  body('registrationLink').isURL().withMessage('Valid registration link is required'),
  body('maxParticipants').isInt({ min: 1 }).withMessage('Maximum participants must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const eventData = req.body;
    
    // Add file paths if uploaded
    if (req.files.posterImage) {
      eventData.posterImage = `/uploads/posters/${req.files.posterImage[0].filename}`;
    }
    
    if (req.files.brochure) {
      eventData.brochure = `/uploads/brochures/${req.files.brochure[0].filename}`;
    }

    // Parse arrays and numbers
    if (typeof eventData.eventType === 'string') {
      eventData.eventType = JSON.parse(eventData.eventType);
    }
    eventData.maxParticipants = parseInt(eventData.maxParticipants);
    eventData.eventDate = new Date(eventData.eventDate);
    eventData.createdBy = req.admin._id;

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private
router.put('/:id', auth, upload.fields([
  { name: 'posterImage', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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

    const updateData = req.body;
    
    // Add file paths if uploaded
    if (req.files.posterImage) {
      updateData.posterImage = `/uploads/posters/${req.files.posterImage[0].filename}`;
    }
    
    if (req.files.brochure) {
      updateData.brochure = `/uploads/brochures/${req.files.brochure[0].filename}`;
    }

    // Parse arrays and numbers
    if (updateData.eventType && typeof updateData.eventType === 'string') {
      updateData.eventType = JSON.parse(updateData.eventType);
    }
    if (updateData.maxParticipants) {
      updateData.maxParticipants = parseInt(updateData.maxParticipants);
    }
    if (updateData.eventDate) {
      updateData.eventDate = new Date(updateData.eventDate);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

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

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

module.exports = router;
