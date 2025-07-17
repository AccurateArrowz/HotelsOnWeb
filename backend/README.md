# HotelsOnWeb Backend

Express.js backend with Sequelize ORM and PostgreSQL for the HotelsOnWeb application.

## Features

- User authentication with JWT
- Hotel management with custom ID generation
- Room type and room management
- Booking system with booking_rooms table approach
- Image management for hotels
- Role-based access control (Guest, User, Hotel Owner, Admin)

## Database Models

### User
- Authentication fields (email, password)
- Personal information (firstName, lastName, phone)
- Role-based access (guest, user, hotel_owner, admin)
- Email verification and password reset functionality

### Hotel
- Custom hotel ID generation (acronym + random number)
- Location information (street, city, country)
- Amenities stored as JSONB
- Rating and active status

### HotelImage
- References to Google Cloud URLs
- Primary image flag and ordering
- Caption support

### RoomType
- Per-hotel room type definitions
- Pricing and capacity information
- Amenities as JSONB

### Room
- Individual physical rooms
- Availability status (available, occupied, maintenance, reserved)
- Room number and floor information

### Booking
- Booking status (pending, confirmed, cancelled, completed)
- Payment status and method
- Check-in/out dates
- Special requests and cancellation tracking

### BookingRoom
- Junction table linking bookings to specific rooms
- Price per night and total price tracking
- Exact room tracking with roomId

## Setup

1. Install dependencies:
```bash
npm install
```

2eate a `.env` file with your database configuration:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotels_on_web
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
```

3. Start the server:
```bash
npm run dev
```

## Database Schema

The application uses the booking_rooms table approach for better data integrity:
- Each booking can have multiple rooms
- Each room booking tracks the specific room (roomId)
- Price calculations are stored per room booking
- Better querying and validation capabilities

## API Endpoints

Coming soon - will include authentication, hotel management, booking, and user management endpoints. 