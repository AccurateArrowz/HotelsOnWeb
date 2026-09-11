# Backend Architecture Guide

## Overview

The HotelsOnWeb backend follows a **modular, feature-based architecture** with clear separation of concerns:

```
Request → Middleware → Controller → Service → Repository → Database
                            ↓
                    Response Handler
```

---

## Directory Structure

### 1. **Middleware** (`src/middleware/`)
Handles cross-cutting concerns before requests reach controllers.

```
src/middleware/
├── auth.middleware.ts       # JWT verification, role-based access
├── validate.middleware.ts   # Zod schema validation
└── error.middleware.ts      # Global error handling
```

**Key Functions:**
- `authenticateToken` - Verifies JWT and attaches user to request
- `optionalAuth` - Allows unauthenticated requests
- `requireRole(roleId)` - Enforces role-based access control
- `validateBody(schema)` - Validates request body
- `asyncHandler(fn)` - Wraps async handlers to catch errors

### 2. **Features** (`src/features/<feature>/`)
Each feature is a self-contained module with its own controller, service, repository, and routes.

```
src/features/
├── auth/
│   ├── auth.controller.ts    # Request handlers
│   ├── auth.service.ts       # Business logic
│   ├── auth.repository.ts    # Database queries
│   ├── auth.routes.ts        # Route definitions
│   └── index.ts              # Module exports
├── hotel/
├── room/
├── booking/
├── media/
└── ... (other features)
```

**Pattern for Each Feature:**

```typescript
// routes.ts - Define routes
router.post('/', authenticateToken, validateBody(schema), controller.create);

// controller.ts - Handle requests
export class HotelController {
  create = asyncHandler(async (req, res) => {
    const hotel = await this.hotelService.createHotel(req.body);
    return ApiResponseHandler.created(res, hotel);
  });
}

// service.ts - Business logic
export class HotelService {
  async createHotel(data) {
    // Validation, calculations, etc.
    return this.hotelRepository.create(data);
  }
}

// repository.ts - Database access
export class HotelRepository extends BaseRepository<Hotel> {
  async create(data) {
    return this.model.create(data);
  }
}
```

### 3. **Models** (`src/models/`)
Sequelize models with TypeScript decorators.

```
src/models/
├── User.ts
├── Hotel.ts
├── Room.ts
├── Booking.ts
├── ... (other models)
└── index.ts              # Associations
```

**Key Models:**
- **User**: Authentication, profile, roles
- **Hotel**: Hotel information, ownership
- **Room**: Individual rooms, status tracking
- **Booking**: Reservations, multi-room support
- **RoomType**: Room categories per hotel

### 4. **Common** (`src/common/`)
Shared utilities, types, and base classes.

```
src/common/
├── types.ts              # TypeScript interfaces
├── api-response.ts       # Response formatting
├── http-error.ts         # Error class
├── base.repository.ts    # Base CRUD methods
└── index.ts              # Exports
```

---

## Request Flow Example

### POST /api/hotels (Create Hotel)

```
1. CLIENT REQUEST
   POST /api/hotels
   Authorization: Bearer <token>
   Content-Type: application/json
   { "name": "Grand Hotel", "city": "NYC", ... }

2. MIDDLEWARE CHAIN
   ↓
   authenticateToken
   - Verifies JWT token
   - Attaches user to req.user
   - Calls next()
   ↓
   validateBody(createHotelSchema)
   - Validates request body against Zod schema
   - Returns 400 if invalid
   - Calls next() if valid
   ↓
   HotelController.create()

3. CONTROLLER
   - Extracts data from req.body
   - Calls HotelService.createHotel()
   - Handles errors with try-catch or asyncHandler
   - Returns response via ApiResponseHandler

4. SERVICE
   - Contains business logic
   - Performs validations
   - Calls HotelRepository methods
   - Returns formatted data

5. REPOSITORY
   - Executes database queries
   - Uses Sequelize ORM
   - Handles associations
   - Returns raw data

6. DATABASE
   - Stores data in PostgreSQL
   - Returns created record

7. RESPONSE
   {
     "success": true,
     "message": "Created",
     "data": { "id": 1, "name": "Grand Hotel", ... }
   }
```

---

## Key Patterns

### 1. Middleware Usage

```typescript
// Public route (no auth required)
router.get('/', HotelController.getHotels);

// Protected route (auth required)
router.post('/', authenticateToken, validateBody(schema), HotelController.create);

// Admin-only route
router.delete('/:id', authenticateToken, requireRole(4), HotelController.delete);

// Optional auth
router.get('/:id', optionalAuth, HotelController.getById);
```

### 2. Validation

```typescript
import { validateBody } from '@/middleware/validate.middleware';
import { createHotelSchema } from '@hotelsonweb/shared';

// In route
router.post('/', validateBody(createHotelSchema), controller.create);

// In controller
export class HotelController {
  create = asyncHandler(async (req: Request, res: Response) => {
    // req.body is already validated
    const { name, city, country } = req.body;
    // ...
  });
}
```

### 3. Error Handling

```typescript
// Using asyncHandler (automatic error catching)
export class HotelController {
  create = asyncHandler(async (req, res) => {
    const hotel = await this.hotelService.createHotel(req.body);
    return ApiResponseHandler.created(res, hotel);
  });
}

// Manual error handling
export class HotelService {
  async getHotelById(id: number) {
    const hotel = await this.hotelRepository.findById(id);
    if (!hotel) {
      throw HttpError.notFound('Hotel not found');
    }
    return hotel;
  }
}

// Global error handler catches all errors
// Returns standardized error response
```

### 4. Response Formatting

```typescript
// Success response
ApiResponseHandler.success(res, data, 'Success message', 200);

// Created response (201)
ApiResponseHandler.created(res, data, 'Created message');

// Paginated response
ApiResponseHandler.successWithPagination(res, data, 'Message', pagination);

// Error responses
ApiResponseHandler.error(res, 'Error message', 400);
ApiResponseHandler.unauthorized(res, 'Unauthorized');
ApiResponseHandler.forbidden(res, 'Forbidden');
ApiResponseHandler.notFound(res, 'Not found');
```

### 5. Repository Pattern

```typescript
export class HotelRepository extends BaseRepository<Hotel> {
  constructor() {
    super(Hotel);
  }

  // Inherited from BaseRepository
  async findById(id: number) { }
  async findAll(options) { }
  async create(data) { }
  async update(id, data) { }
  async delete(id) { }

  // Custom methods
  async findActiveHotels(search?: string, limit = 20, offset = 0) {
    return this.findAll({
      where: {
        isActive: true,
        ...(search && { name: { [Op.iLike]: `%${search}%` } })
      },
      limit,
      offset,
      include: [{ association: 'images' }]
    });
  }
}
```

---

## API Routes

All routes are mounted in `src/app.ts`:

```typescript
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/hotels/:hotelId/rooms', roomRoutes);
app.use('/api/hotels/:hotelId/room-types', roomTypeRoutes);
app.use('/api/hotels/:hotelId/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotel-requests', hotelRequestRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/rbac', rbacRoutes);
```

---

## Adding a New Feature

1. **Create Feature Directory**
   ```bash
   mkdir src/features/my-feature
   ```

2. **Create Files**
   ```
   src/features/my-feature/
   ├── my-feature.controller.ts
   ├── my-feature.service.ts
   ├── my-feature.repository.ts
   ├── my-feature.routes.ts
   └── index.ts
   ```

3. **Define Model** (if needed)
   ```typescript
   // src/models/MyFeature.ts
   @Table({ tableName: 'MyFeatures' })
   export default class MyFeature extends Model { }
   ```

4. **Add Associations** (if needed)
   ```typescript
   // src/models/index.ts
   MyFeature.hasMany(OtherModel, { foreignKey: 'myFeatureId' });
   ```

5. **Create Repository**
   ```typescript
   export class MyFeatureRepository extends BaseRepository<MyFeature> {
     constructor() { super(MyFeature); }
   }
   ```

6. **Create Service**
   ```typescript
   export class MyFeatureService {
     private repository = new MyFeatureRepository();
     async getAll() { return this.repository.findAll(); }
   }
   ```

7. **Create Controller**
   ```typescript
   export class MyFeatureController {
     private service = new MyFeatureService();
     getAll = asyncHandler(async (req, res) => {
       const data = await this.service.getAll();
       return ApiResponseHandler.success(res, data);
     });
   }
   ```

8. **Create Routes**
   ```typescript
   const router = Router();
   const controller = new MyFeatureController();
   router.get('/', controller.getAll);
   export default router;
   ```

9. **Export Module**
   ```typescript
   // index.ts
   export { default as myFeatureRoutes } from './my-feature.routes';
   ```

10. **Mount Routes** (in app.ts)
    ```typescript
    const { myFeatureRoutes } = require('./features/my-feature');
    app.use('/api/my-features', myFeatureRoutes);
    ```

---

## Best Practices

1. **Middleware First**: Always validate and authenticate at the middleware level
2. **Error Handling**: Use `asyncHandler` to wrap async route handlers
3. **Type Safety**: Use TypeScript types and interfaces
4. **Separation of Concerns**: Keep logic in services, not controllers
5. **DRY**: Use base repository for common CRUD operations
6. **Validation**: Validate at the middleware level using Zod
7. **Response Formatting**: Always use `ApiResponseHandler` for consistent responses
8. **Error Messages**: Use `HttpError` class for custom errors
9. **Associations**: Define all model associations in `models/index.ts`
10. **Imports**: Use path aliases (`@/`) for cleaner imports

---

## Debugging Tips

1. **Check Middleware Order**: Middleware executes in order of definition
2. **Verify Associations**: Ensure models are properly associated
3. **Check Validation**: Validate request data matches schema
4. **Review Logs**: Check console output for startup logs
5. **Test Routes**: Use Postman or curl to test endpoints
6. **Check Permissions**: Verify user has required role
7. **Database Queries**: Use Sequelize logging to debug queries

---

## Related Files

- `BACKEND_OVERVIEW.md` - Quick reference guide
- `API_DOCUMENTATION.md` - Detailed endpoint documentation and response shapes
- `BACKEND_MIGRATION_TO_TS.md` - TypeScript migration notes
