// Test basic server startup without MongoDB
console.log('Testing server startup...');

try {
  // Test if we can load the dependencies
  const express = require('express');
  const mongoose = require('mongoose');
  console.log('✅ Dependencies loaded successfully');
  
  // Test MongoDB connection
  console.log('Testing MongoDB connection...');
  mongoose.connect('mongodb://localhost:27017/college-event')
    .then(() => {
      console.log('✅ MongoDB connected successfully');
      
      // Test creating a simple Express app
      const app = express();
      app.get('/test', (req, res) => {
        res.json({ message: 'Server is working!' });
      });
      
      console.log('✅ Express app created successfully');
      console.log('✅ All tests passed - server should be able to start');
      
      mongoose.connection.close();
      process.exit(0);
    })
    .catch(err => {
      console.log('❌ MongoDB connection failed:', err.message);
      console.log('This is likely the cause of the 500 error');
      process.exit(1);
    });
} catch (error) {
  console.log('❌ Error loading dependencies:', error.message);
  process.exit(1);
}
