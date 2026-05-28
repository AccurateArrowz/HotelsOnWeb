# HotelsOnWeb Backend

Express.js API with TypeScript, Sequelize ORM, and PostgreSQL. Handles authentication, hotel management, bookings, and image uploads.

## Quick Start

```bash
npm install
npm run dev
```

Runs on `http://localhost:3001` (configured via `PORT` env var).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development with nodemon + ts-node |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production code |
| `npm run migrate` | Run Sequelize migrations |
| `npm run migrate:undo` | Undo last migration |
| `npm run seed` | Run seed scripts |
| `npm run db:reset` | Full reset: undo all → migrate → seed |

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Language**: TypeScript 5
- **ORM**: Sequelize 6
- **Database**: PostgreSQL 17+ (hosted on [Neon](https://neon.tech))
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator + Zod
- **Uploads**: ImageKit + multer
- **Testing**: Jest

## Project Structure

```
src/
├── config/               # Database and app configuration
│   └── database.ts       # Sequelize connection setup
│
├── controllers/          # Request handlers
│   ├── AuthController.js
│   ├── HotelController.js
│   ├── HotelRequestController.js
│   ├── MediaController.js
│   ├── RoomController.js
│   ├── RoomTypeController.js
│   └── bookingController.js
│
├── routes/               # Route definitions
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── hotelRequestRoutes.js
│   ├── hotelRoutes.js
│   ├── mediaRoutes.js
│   ├── roomRoutes.js
│   └── roomTypeRoutes.js
│
├── models/               # Sequelize models and associations
│   ├── index.js          # Associations (User, Hotel, Booking, etc.)
│   ├── User.js
│   ├── Hotel.js
│   ├── Room.js
│   ├── Booking.js
│   └── ... (see src/models for full list)
│
├── middleware/           # Express middleware
│   ├── auth.js           # JWT verification
│   ├── validate.js       # Zod validation runner
│   ├── upload.js         # Multer configuration for ImageKit
│   └── errorHandler.js   # Global error handling
│
├── validations/          # Zod schemas (shared with frontend)
│   └── authValidation.js # Register/login schemas
│
├── services/             # Business logic layer
│   └── (extensible for complex operations)
│
└── utils/                # Utilities
```

## Database Architecture

### Core Entities

**User**
- Authentication: email, password (bcrypt hashed)
- Profile: firstName, lastName, phone
- Roles: `guest`, `user`, `hotel_owner`, `admin`
- Features: email verification, password reset

**Hotel**
- Custom ID generation: acronym + random number (e.g., `HTL-4729`)
- Location: street, city, country
- Amenities: JSONB array for flexibility
- Relations: owner (User), images, room types, rooms

**RoomType**
- Per-hotel room category definitions
- Pricing: pricePerNight
- Capacity: maxGuests, bedConfiguration
- Amenities: JSONB array

**Room**
- Individual physical room inventory
- Status: `available`, `occupied`, `maintenance`, `reserved`
- Attributes: roomNumber, floor

**Booking** + **BookingRoom** (Junction)
```
booking → booking_rooms ← rooms
```
- Booking tracks: status, payment, dates, guest info
- BookingRoom tracks: which specific room, price snapshot
- Supports multi-room bookings with per-room pricing

**HotelRequest**
- Workflow for new hotel approvals
- Status: `pending`, `approved`, `rejected`
- Admin review interface

## API Endpoints

For full endpoint details, request/response shapes, and authentication, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Validation

Zod schemas for runtime validation (shared with frontend):

```typescript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});
```

Middleware pattern:
```javascript
router.post('/register', validate(registerSchema), register);
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_HOST` | Yes | PostgreSQL host |
| `DB_PORT` | Yes | PostgreSQL port |
| `DB_NAME` | Yes | Database name |
| `DB_USER` | Yes | Database user |
| `DB_PASSWORD` | Yes | Database password |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `JWT_SECRET` | Yes | JWT signing secret |
| `CORS_ORIGIN` | No | Comma-separated allowed frontend origins |
| `IMAGEKIT_PUBLIC_KEY` | Yes | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | Yes | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | Yes | ImageKit URL endpoint |

## Database Migrations

```bash
# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Run pending migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Reset everything
npm run db:reset
```

Migration files in `src/migrations/`.

## Seeding

```bash
# Run all seeders
npm run seed:run

# Generate seed from existing data
npm run seed:generate

# Custom seed scripts
npm run seed        # seedData.js
npm run test-seed   # testSeed.js
```

## Error Handling

Global error handler in `src/middleware/errorHandler.js`:
- Catches all unhandled errors
- Returns standardized error format
- Logs stack trace in development
- Hides internals in production

## Security Considerations

- **CORS**: Configured for specific origins
- **Input Validation**: Zod + express-validator
- **Password Hashing**: bcryptjs with salt rounds 10
- **JWT**: Short expiration + refresh token pattern

## Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch
```

Test files: `*.test.js` co-located with source files.

## Deployment

### Render
1. Create Web Service from GitHub repo
2. Set root directory to `backend`
3. Add PostgreSQL instance
4. Configure environment variables
5. Build command: `npm install && npm run build`
6. Start command: `npm start`

### Environment-Specific Notes
- **Development**: Uses ts-node for direct TypeScript execution
- **Production**: Compiles to `dist/` and runs compiled JS
- **Database**: Migrations run manually; not auto-applied on deploy

## Performance Considerations

- **N+1 Query Prevention**: Efficient use of Sequelize `include` with required/nested associations to minimize database roundtrips.
- **Scalable ID Strategy**: Implementation of custom URL-friendly IDs (`acronym` + `random`) for improved SEO and user experience.
- **Normalization**: Structured database schema with specialized junction tables (`booking_rooms`) to support complex business requirements like multi-room bookings.
- **Centralized Validation**: Shared Zod schemas ensuring consistent data integrity across the entire stack.

## Extending the API

Adding a new resource:
1. Create model in `src/models/`
2. Define associations in `src/models/index.js`
3. Create controller in `src/controllers/`
4. Add routes in `src/routes/`
5. Mount router in server entry point
6. Add validation schema if needed

## Common Tasks

### Reset Database
```bash
npm run db:reset
```

### View Logs
```bash
# Development
npm run dev  # Logs to console

# Production (Render)
# Check Render dashboard logs
```

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Ensure database exists: `createdb hotels_on_web`
