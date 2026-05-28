const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./src/config/database');
require('./src/models');

const startupStart = Date.now();
console.log(`[STARTUP] Server initialization started at ${new Date().toISOString()}`);

const app = express();
const PORT = process.env.PORT || 5012;

// Import routes
const hotelRoutes = require('./src/routes/hotelRoutes');
const authRoutes = require('./src/routes/authRoutes');
const hotelRequestRoutes = require('./src/routes/hotelRequestRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const roomTypeRoutes = require('./src/routes/roomTypeRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const roomsAvailabilityRoutes = require('./src/routes/roomsAvailabilityRoutes');

// Middleware
const isProduction = process.env.NODE_ENV === 'production';

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOrigins = new Set(parseOrigins(process.env.CORS_ORIGIN));

if (!isProduction) {
  for (const origin of ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001']) {
    corsOrigins.add(origin);
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (corsOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'hotels-on-web-api',
  });
});

// API routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/hotels/:hotelId/room-types', roomTypeRoutes);
app.use('/api/hotels/:hotelId/rooms', roomRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hotel-requests', hotelRequestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api', roomsAvailabilityRoutes);

// Initialize database and start server
async function startServer() {
  try {
    const dbConnectStart = Date.now();
    // Test database connection
    await sequelize.authenticate();
    console.log(`[STARTUP] Database connected in ${Date.now() - dbConnectStart}ms`);

    const dbSyncStart = Date.now();
    // 'alter' Syncs all models with database (/ create tables)
    await sequelize.sync({ force: false , alter: false }); // Set force: false to preserve existing data
    console.log(`[STARTUP] Database sync completed in ${Date.now() - dbSyncStart}ms`);

    // Start server
    app.listen(PORT, () => {
      const totalTime = Date.now() - startupStart;
      console.log(`[STARTUP] Server ready on port ${PORT} (total startup: ${totalTime}ms ~${(totalTime/1000).toFixed(1)}s)`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
