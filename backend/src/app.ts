import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorMiddleware } from './middleware/error.middleware';

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

const app: Express & { initialize?: () => Promise<void> } = express();

// Middleware
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan(isProduction ? 'combined' : 'dev'));
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
  const { getSequelize } = require('./config/database.js');
  const sequelize = getSequelize();
  
  // Import new TypeScript modules
  const { authRoutes } = require('./features/auth');
  const { hotelRoutes } = require('./features/hotel');
  const { roomRoutes } = require('./features/room');
  const { roomTypeRoutes } = require('./features/roomType');
  const { availabilityRoutes } = require('./features/availability');
  const { bookingRoutes } = require('./features/booking');
  const { hotelRequestRoutes } = require('./features/hotel-request');
  const { mediaRoutes } = require('./features/media');
  const { rbacRoutes } = require('./features/rbac');

  // API routes - New TypeScript modules
  app.use('/api/auth', authRoutes);
  app.use('/api/hotels', hotelRoutes);
  app.use('/api/hotels/:hotelId/rooms', roomRoutes);
  app.use('/api/hotels/:hotelId/room-types', roomTypeRoutes);
  app.use('/api/hotels/:hotelId/availability', availabilityRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/hotel-requests', hotelRequestRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/rbac', rbacRoutes);

  // Global error handler (must be after all routes)
  app.use(errorMiddleware);

  // Initialize database
  const dbConnectStart = Date.now();
  await sequelize.authenticate();
  console.log(`[STARTUP] Database connected in ${Date.now() - dbConnectStart}ms`);

  const dbSyncStart = Date.now();
  await sequelize.sync({ force: false, alter: false });
  console.log(`[STARTUP] Database sync completed in ${Date.now() - dbSyncStart}ms`);
};

export = app;
