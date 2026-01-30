// Simple test to check if we can create an event
const axios = require('axios');

async function testEventCreation() {
  try {
    // Test data for event creation
    const testData = {
      name: 'Test Event',
      organizingBody: 'IT',
      cellsAndAssociation: 'IT',
      eventDate: '2024-12-31',
      description: 'Test description',
      rules: 'Test rules',
      registrationLink: '#',
      mode: 'Online',
      maxParticipants: 100,
      isPublished: false,
      eventCoordinator: {
        name: 'Test Coordinator',
        contact: '1234567890'
      }
    };

    console.log('Testing event creation with data:', testData);

    // You'll need to add a valid JWT token here
    const token = 'YOUR_JWT_TOKEN';
    
    const response = await axios.post('http://localhost:8000/api/events', testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Event created successfully:', response.data);
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
  }
}

testEventCreation();
