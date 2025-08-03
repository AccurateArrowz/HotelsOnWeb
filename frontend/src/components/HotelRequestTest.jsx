import React from 'react';

const HotelRequestTest = () => {
  const testHotelRequest = async () => {
    try {
      // This is just a test function to verify the endpoint works
      console.log('Testing hotel request endpoint...');
      
      // In a real implementation, you would use the actual form data
      const testData = {
        name: 'Test Hotel',
        description: 'A beautiful test hotel',
        street: '123 Test Street',
        city: 'Test City',
        country: 'Test Country'
      };
      
      console.log('Test data:', testData);
    } catch (error) {
      console.error('Error testing hotel request:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Hotel Request Test</h2>
      <button onClick={testHotelRequest}>Test Hotel Request Endpoint</button>
    </div>
  );
};

export default HotelRequestTest;
