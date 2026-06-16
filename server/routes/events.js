const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads with absolute paths
const uploadsDir = path.join(__dirname, '../uploads');
const postersDir = path.join(uploadsDir, 'posters');
const brochuresDir = path.join(uploadsDir, 'brochures');

// Ensure directories exist
[uploadsDir, postersDir, brochuresDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'posterImage') {
      cb(null, postersDir);
    } else if (file.fieldname === 'brochure') {
      cb(null, brochuresDir);
    } else {
      cb(null, uploadsDir);
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

// @route   GET /api/events/public
// @desc    Get all published events (for students/public access)
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { category, type } = req.query;
    let filter = { isPublished: true };

    if (category && category !== 'All') {
      filter.cellsAndAssociation = category;
    }

    if (type && type !== 'All') {
      if (type === 'Outer College') {
        filter.isOuterCollegeEvent = true;
      } else {
        filter.eventType = type;
      }
    }

    const events = await Event.find(filter)
      .select('name description eventDate venue mode posterImage cellsAndAssociation eventType isOuterCollegeEvent hostCollegeName externalEventLink status')
      .sort({ eventDate: -1 });

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get public events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/events/public/:id
// @desc    Get single published event
// @access  Public
router.get('/public/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or not published'
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get public event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event details'
    });
  }
});

// @route   GET /api/events
// @desc    Get all events for a cells and association
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { cellsAndAssociation, status } = req.query;
    let filter = {};

    // Bypass filter for super_admin or 'OT' association
    const isSuperAdmin = req.admin.role === 'super_admin';
    const isOT = req.admin.cellsAndAssociation === 'OT';

    if (!isSuperAdmin && !isOT) {
      filter.cellsAndAssociation = req.admin.cellsAndAssociation;
    } else if (cellsAndAssociation && cellsAndAssociation !== 'ALL' && cellsAndAssociation !== 'all') {
      // super_admin/OT can filter by specific association if they choose
      filter.cellsAndAssociation = cellsAndAssociation;
    }

    if (status && status !== 'all') {
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
    const isSuperAdmin = req.admin.role === 'super_admin';
    const isCreator = event.createdBy._id.toString() === req.admin._id.toString();
    const sameAssociation = event.cellsAndAssociation === req.admin.cellsAndAssociation;

    if (!isSuperAdmin && !isCreator && !sameAssociation) {
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
]), async (req, res) => {
  try {
    const body = req.body;
    const isOuterCollegeEvent = body.isOuterCollegeEvent === 'true' || body.isOuterCollegeEvent === true;

    // Smartly derive cellsAndAssociation from organizingBody mapping
    let derivedAssociation = body.cellsAndAssociation || req.admin.cellsAndAssociation || 'IT';
    const orgBody = body.organizingBody?.toUpperCase().trim();

    // Explicit mapping for all common variants
    if (orgBody) {
      if (orgBody.includes('IIC') || orgBody.includes('INNOVATION')) {
        derivedAssociation = 'IIC';
      } else if (orgBody.includes('EMDC') || orgBody.includes('ENTREPRENEUR')) {
        derivedAssociation = 'EMDC';
      } else if (orgBody.includes('IT') || orgBody.includes('INFORMATION')) {
        derivedAssociation = 'IT';
      }
    }

    // Robust field mapping for nested objects sent via FormData
    const eventData = {
      name: body.name || (isOuterCollegeEvent ? 'Outer College Event' : ''),
      organizingBody: body.organizingBody || (isOuterCollegeEvent ? 'External' : ''),
      description: body.description || 'See poster for details',
      rules: body.rules || 'See poster for details',
      mode: body.mode || 'Offline',
      venue: body.venue || (body.mode === 'Offline' ? '' : 'Online'),
      cellsAndAssociation: derivedAssociation,
      eventLink: body.eventLink || '',
      whatsappGroupLink: body.whatsappGroupLink || '',
      registrationLink: body.registrationLink || '#',
      isOuterCollegeEvent,
      hostCollegeName: body.hostCollegeName || null,
      externalEventLink: body.externalEventLink || null,
      status: body.status || 'Upcoming',
      isPublished: body.isPublished === 'true' || body.isPublished === true,
      createdBy: req.admin._id,
      eventCoordinator: {
        name: body['eventCoordinator.name'] ||
          (body.eventCoordinator && body.eventCoordinator.name) ||
          body['eventCoordinator[name]'] || 'TBD',
        contact: body['eventCoordinator.contact'] ||
          (body.eventCoordinator && body.eventCoordinator.contact) ||
          body['eventCoordinator[contact]'] || 'N/A'
      }
    };

    // Validation
    if (!isOuterCollegeEvent) {
      const requiredFields = ['name', 'organizingBody', 'description', 'rules'];
      for (const field of requiredFields) {
        if (!eventData[field] || eventData[field].trim() === '') {
          return res.status(400).json({ success: false, message: `${field} is required` });
        }
      }
    }

    // Handle files
    if (req.files) {
      if (req.files.posterImage) {
        eventData.posterImage = `/uploads/posters/${req.files.posterImage[0].filename}`;
      }
      if (req.files.brochure) {
        eventData.brochure = `/uploads/brochures/${req.files.brochure[0].filename}`;
      }
    }

    // Parse numeric/date fields safely
    if (body.maxParticipants && body.maxParticipants !== '') {
      const max = parseInt(body.maxParticipants);
      eventData.maxParticipants = isNaN(max) ? 100 : max;
    } else {
      eventData.maxParticipants = 100;
    }

    if (body.eventDate) {
      eventData.eventDate = new Date(body.eventDate);
    }

    // registrationEndDate in model is String but client sends Date
    if (body.registrationEndDate) {
      eventData.registrationEndDate = body.registrationEndDate;
    }

    // Handle eventType array
    if (body.eventType) {
      if (typeof body.eventType === 'string') {
        try {
          eventData.eventType = JSON.parse(body.eventType);
        } catch (e) {
          eventData.eventType = [body.eventType];
        }
      } else if (Array.isArray(body.eventType)) {
        eventData.eventType = body.eventType;
      }
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('[CRITICAL] Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating event'
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
    if (updateData.registrationEndDate) {
      updateData.registrationEndDate = new Date(updateData.registrationEndDate);
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

// @route   GET /api/events/:id/export
// @desc    Export event registrations as CSV
// @access  Private
router.get('/:id/export', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if admin has access to this event
    if (event.createdBy.toString() !== req.admin._id.toString() && req.admin.role !== 'super_admin' && req.admin.cellsAndAssociation !== 'OT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let registrations = [];
    let csvHeaders = [];
    let csvRows = [];

    // Check if it's an outer college event
    if (event.isOuterCollegeEvent) {
      const OuterCollegeRegistration = require('../models/OuterCollegeRegistration');
      registrations = await OuterCollegeRegistration.find({ eventId: req.params.id });

      csvHeaders = ['S.No', 'Participant Name', 'Roll Number', 'Department', 'Year of Study', 'Contact Number', 'Email', 'Mode', 'Status', 'Registration Date'];
      csvRows = registrations.map((reg, index) => [
        index + 1,
        reg.participantName,
        reg.rollNumber,
        reg.department || 'N/A',
        reg.yearOfStudy || 'N/A',
        reg.contactNumber,
        reg.email || 'N/A',
        reg.modeOfParticipation,
        reg.status,
        new Date(reg.createdAt).toLocaleDateString()
      ]);
    } else {
      const Registration = require('../models/Registration');
      registrations = await Registration.find({ event: req.params.id });

      csvHeaders = ['S.No', 'Student Name', 'Email', 'Phone', 'Year', 'Status', 'Registration Date'];
      csvRows = registrations.map((reg, index) => [
        index + 1,
        reg.studentName,
        reg.studentEmail,
        reg.studentPhone,
        reg.studentYear,
        reg.status,
        new Date(reg.registrationDate).toLocaleDateString()
      ]);
    }

    // Generate CSV content
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    let csvContent = csvHeaders.map(escapeCSV).join(',') + '\n';
    csvRows.forEach(row => {
      csvContent += row.map(escapeCSV).join(',') + '\n';
    });

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${event.name.replace(/[^a-z0-9]/gi, '_')}_registrations.csv"`);

    res.send(csvContent);
  } catch (error) {
    console.error('Export event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting registrations'
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
