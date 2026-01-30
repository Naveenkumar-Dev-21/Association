// Test script to verify IIC events API fix
const mongoose = require('mongoose');
const Event = require('./server/models/Event');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/college-event')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Test 1: Find all events (like OT admin would see)
      const allEvents = await Event.find({});
      console.log(`\n=== All Events in Database (${allEvents.length} total) ===`);
      allEvents.forEach(event => {
        console.log(`- ${event.name} (${event.cellsAndAssociation}/${event.organizingBody}) - ${event.status} - Published: ${event.isPublished}`);
      });

      // Test 2: Find events with organizingBody = "IIC"
      const iicEvents = await Event.find({ organizingBody: "IIC" });
      console.log(`\n=== IIC Events (${iicEvents.length} found) ===`);
      iicEvents.forEach(event => {
        console.log(`- ${event.name} (${event.cellsAndAssociation}/${event.organizingBody}) - ${event.status} - Published: ${event.isPublished}`);
      });

      // Test 3: Find published events (like public API would return)
      const publishedEvents = await Event.find({ isPublished: true });
      console.log(`\n=== Published Events (${publishedEvents.length} found) ===`);
      publishedEvents.forEach(event => {
        console.log(`- ${event.name} (${event.cellsAndAssociation}/${event.organizingBody}) - ${event.status}`);
      });

      // Test 4: Find events by cellsAndAssociation = "IIC" (like user IIC page)
      const iicByCells = await Event.find({ cellsAndAssociation: "IIC", isPublished: true });
      console.log(`\n=== IIC Events by cellsAndAssociation (${iicByCells.length} found) ===`);
      iicByCells.forEach(event => {
        console.log(`- ${event.name} (${event.cellsAndAssociation}/${event.organizingBody}) - ${event.status}`);
      });

    } catch (error) {
      console.error('Error testing events:', error);
    } finally {
      mongoose.connection.close();
      console.log('\nDisconnected from MongoDB');
    }
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
