const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
require('./src/models');

const app = express();
const PORT = process.env.PORT || 5012;

// Import routes
const hotelRoutes = require('./src/routes/hotelRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

