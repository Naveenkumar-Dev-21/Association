const express = require('express');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/downloads/registrations/:eventId
// @desc    Get registration data for export
// @access  Private
router.get('/registrations/:eventId', auth, async (req, res) => {
  try {
    const { format } = req.query; // csv, json
    
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

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Student Name,Email,Phone,Year,Registration Date,Status\n';
      const csvData = registrations.map(reg => 
        `"${reg.studentName}","${reg.studentEmail}","${reg.studentPhone}","${reg.studentYear}","${reg.registrationDate.toISOString().split('T')[0]}","${reg.status}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="registrations-${event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv"`);
      res.send(csvHeader + csvData);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: {
          event: {
            name: event.name,
            date: event.eventDate,
            department: event.department
          },
          registrations,
          total: registrations.length
        }
      });
    }
  } catch (error) {
    console.error('Download registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading registrations'
    });
  }
});

// @route   GET /api/downloads/events
// @desc    Get all events data for export
// @access  Private
router.get('/events', auth, async (req, res) => {
  try {
    const { format, cellsAndAssociation } = req.query;
    
    let filter = { createdBy: req.admin._id };
    
    if (cellsAndAssociation && cellsAndAssociation !== 'ALL') {
      filter.cellsAndAssociation = cellsAndAssociation;
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Event Name,Organizing Body,Event Type,Mode,Date,Venue,Cells and Association,Status,Max Participants,Current Registrations,Created By,Created Date\n';
      const csvData = events.map(event => 
        `"${event.name}","${event.organizingBody}","${event.eventType.join(', ')}","${event.mode}","${event.eventDate.toISOString().split('T')[0]}","${event.venue || 'N/A'}","${event.cellsAndAssociation}","${event.status}",${event.maxParticipants},${event.currentRegistrations},"${event.createdBy.name}","${event.createdAt.toISOString().split('T')[0]}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="events-report-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csvHeader + csvData);
    } else {
      res.json({
        success: true,
        data: {
          events,
          total: events.length
        }
      });
    }
  } catch (error) {
    console.error('Download events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while downloading events'
    });
  }
});

// @route   GET /api/downloads/summary
// @desc    Get summary report for admin dashboard
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const adminEvents = await Event.find({ createdBy: req.admin._id });
    
    const totalEvents = adminEvents.length;
    const ongoingEvents = adminEvents.filter(e => e.status === 'Ongoing').length;
    const upcomingEvents = adminEvents.filter(e => e.status === 'Upcoming').length;
    const completedEvents = adminEvents.filter(e => e.status === 'Completed').length;
    
    const totalRegistrations = adminEvents.reduce((sum, event) => sum + event.currentRegistrations, 0);
    
    // Get registrations by department
    const registrationsByDept = {};
    for (const event of adminEvents) {
      const registrations = await Registration.find({ event: event._id });
      registrations.forEach(reg => {
        if (!registrationsByDept[reg.studentDepartment]) {
          registrationsByDept[reg.studentDepartment] = 0;
        }
        registrationsByDept[reg.studentDepartment]++;
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalEvents,
          ongoingEvents,
          upcomingEvents,
          completedEvents,
          totalRegistrations,
          registrationsByDepartment: registrationsByDept
        }
      }
    });
  } catch (error) {
    console.error('Download summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating summary'
    });
  }
});

module.exports = router;
