const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
require('./src/models');

const app = express();
const PORT = process.env.PORT || 5012;

// Import routes
const hotelRoutes = require('./src/routes/hotels');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'HotelsOnWeb API is running!' });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: 'Database connection successful!' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Test hotel count
app.get('/test-hotels', async (req, res) => {
  try {
    const Hotel = require('./src/models/Hotel');
    const count = await Hotel.count();
    res.json({ message: `Found ${count} hotels in database` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count hotels', details: error.message });
  }
});

// API routes
app.use('/api/hotels', hotelRoutes);

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models with database (create tables)
    await sequelize.sync({ force: false , alter: false }); // Set force: false to preserve existing data
    console.log('Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer(); 

