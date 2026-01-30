// Script to update existing events without posters
const mongoose = require('mongoose');
const Event = require('./server/models/Event');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/college-event')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Find all events without poster images
      const eventsWithoutPosters = await Event.find({ posterImage: { $in: [null, '', undefined] } });
      console.log(`Found ${eventsWithoutPosters.length} events without posters`);
      
      if (eventsWithoutPosters.length === 0) {
        console.log('All events already have posters!');
        process.exit(0);
      }
      
      // For each event without a poster, we'll set a default poster path
      // You can manually upload posters later or use this as a placeholder
      for (const event of eventsWithoutPosters) {
        console.log(`Updating event: ${event.name}`);
        
        // Option 1: Set a default poster path (you'll need to create this image)
        // event.posterImage = '/uploads/posters/default-poster.png';
        
        // Option 2: Just log which events need posters
        console.log(`  - Event ID: ${event._id}`);
        console.log(`  - Event Name: ${event.name}`);
        console.log(`  - Organizing Body: ${event.organizingBody}`);
        console.log(`  - Needs poster upload`);
        console.log('---');
        
        // Uncomment the line below to actually update with a default poster
        // await event.save();
      }
      
      console.log('\nTo fix this:');
      console.log('1. Upload poster images for these events via the admin panel');
      console.log('2. Or create a default poster image and uncomment the save line');
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
