import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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
  origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
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

const app: Express = express();

// Middleware
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'hotels-on-web-api',
  });
});

// Initialize database and routes
app.initialize = async () => {
  // Load dependencies after app is created
  const sequelize = require('./src/config/database.js');
  const hotelRoutes = require('./src/routes/hotelRoutes.cjs');
  const authRoutes = require('./src/routes/authRoutes.cjs');
  const hotelRequestRoutes = require('./src/routes/hotelRequestRoutes.cjs');
  const bookingRoutes = require('./src/routes/bookingRoutes.cjs');
  const mediaRoutes = require('./src/routes/mediaRoutes.cjs');
  const roomTypeRoutes = require('./src/routes/roomTypeRoutes.cjs');
  const roomRoutes = require('./src/routes/roomRoutes.cjs');
  const roomsAvailabilityRoutes = require('./src/routes/roomsAvailabilityRoutes.cjs');

  // API routes
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/hotels/:hotelId/room-types', roomTypeRoutes);
  app.use('/api/hotels/:hotelId/rooms', roomRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/hotel-requests', hotelRequestRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api', roomsAvailabilityRoutes);

  // Initialize database
  const dbConnectStart = Date.now();
  await sequelize.authenticate();
  console.log(`[STARTUP] Database connected in ${Date.now() - dbConnectStart}ms`);

  const dbSyncStart = Date.now();
  await sequelize.sync({ force: false, alter: false });
  console.log(`[STARTUP] Database sync completed in ${Date.now() - dbSyncStart}ms`);
};

export = app;
