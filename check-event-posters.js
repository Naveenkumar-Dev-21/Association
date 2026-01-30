// Check event data and poster images in database
const mongoose = require('mongoose');
const Event = require('./server/models/Event');

mongoose.connect('mongodb://localhost:27017/college-event')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find all events
      const events = await Event.find({});
      console.log(`\n=== Found ${events.length} events in database ===`);
      
      events.forEach((event, index) => {
        console.log(`\nEvent ${index + 1}:`);
        console.log(`  Name: ${event.name}`);
        console.log(`  ID: ${event._id}`);
        console.log(`  posterImage: ${event.posterImage}`);
        console.log(`  organizingBody: ${event.organizingBody}`);
        console.log(`  cellsAndAssociation: ${event.cellsAndAssociation}`);
        console.log(`  isPublished: ${event.isPublished}`);
        console.log(`  isOuterCollegeEvent: ${event.isOuterCollegeEvent}`);
        console.log(`  createdAt: ${event.createdAt}`);
      });
      
      // Check which events have poster images
      const eventsWithPosters = events.filter(event => event.posterImage);
      console.log(`\n=== ${eventsWithPosters.length} events have poster images ===`);
      
      eventsWithPosters.forEach((event, index) => {
        console.log(`${index + 1}. ${event.name}: ${event.posterImage}`);
      });
      
      // Check events without posters
      const eventsWithoutPosters = events.filter(event => !event.posterImage);
      console.log(`\n=== ${eventsWithoutPosters.length} events without poster images ===`);
      
      eventsWithoutPosters.forEach((event, index) => {
        console.log(`${index + 1}. ${event.name} (ID: ${event._id})`);
      });
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
