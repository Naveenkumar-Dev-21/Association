console.log('Testing database connection...');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/college-event')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
