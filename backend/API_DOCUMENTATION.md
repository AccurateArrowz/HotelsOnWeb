# HotelsOnWeb API Documentation

## Overview

This document provides comprehensive documentation for the HotelsOnWeb REST API. All endpoints follow a standardized response format for consistency and ease of integration.

## Base URL

```
http://localhost:3001/api
```

### Standard Response Format (TypeScript)

The API uses TypeScript and Zod for response standardization and validation.

#### Response Schemas

```typescript
import { z } from 'zod';

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.any().optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

export const ErrorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(ErrorDetailSchema).optional(),
});
```

### Request Validation (Zod)

All requests are validated using Zod schemas before reaching the controllers. If validation fails, a `400 Bad Request` is returned with the following format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.email",
      "message": "Invalid email format"
    }
  ]
}
```

#### Example Auth Validation Schema

```typescript
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
```

## HTTP Status Codes

- `200 OK`: Successful GET, PUT, PATCH requests
- `201 Created`: Successful POST request creating a resource
- `400 Bad Request`: Invalid request data or validation errors
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server-side error

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### Register User

Register a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "password": "securePassword123",
  "role": "customer" // Optional: defaults to 'customer'
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "role": "customer",
    "roleId": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: User already exists or invalid role
- `500 Internal Server Error`: Server error

#### Login

Authenticate a user and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "customer",
    "roleId": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Server error

### Hotels

#### Get Hotel by ID

Retrieve detailed information about a specific hotel.

**Endpoint:** `GET /hotels/:id`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grand Hotel",
    "description": "Luxury hotel in the city center",
    "street": "123 Main Street",
    "city": "New York",
    "country": "USA",
    "isActive": true,
    "images": [
      {
        "id": 1,
        "imageUrl": "https://example.com/image1.jpg",
        "isPrimary": true,
        "orderIndex": 0
      }
    ],
    "roomTypes": [
      {
        "id": 1,
        "name": "Deluxe Room",
        "basePrice": 150
      }
    ]
  }
}
```

**Error Responses:**
- `404 Not Found`: Hotel not found
- `500 Internal Server Error`: Server error

#### Search Hotels by City or Name

Search for hotels by city name or hotel name.

**Endpoint:** `GET /hotels/search?q=<query>`

**Authentication:** Not required

**Query Parameters:**
- `q` (required): Search query (city name or hotel name)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Grand Hotel",
      "city": "New York",
      "hotelImg": "https://example.com/image1.jpg"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Missing or invalid search query
- `500 Internal Server Error`: Server error

### Hotel Requests (Hotel Owner)

#### Create Hotel Request

Submit a new hotel listing request for approval.

**Endpoint:** `POST /hotel-requests`

**Authentication:** Required (Hotel Owner role)

**Request Body:**
```json
{
  "name": "New Hotel",
  "description": "A beautiful hotel",
  "street": "456 Oak Avenue",
  "city": "Los Angeles",
  "country": "USA",
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Hotel listing request submitted successfully",
  "data": {
    "id": 1,
    "name": "New Hotel",
    "description": "A beautiful hotel",
    "street": "456 Oak Avenue",
    "city": "Los Angeles",
    "country": "USA",
    "status": "pending",
    "userId": 1,
    "images": [
      {
        "id": 1,
        "imageUrl": "https://example.com/image1.jpg",
        "isPrimary": true,
        "orderIndex": 0
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

#### Get User Hotel Requests

Retrieve all hotel requests for the authenticated user.

**Endpoint:** `GET /hotel-requests/my-requests`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "New Hotel",
      "status": "pending",
      "images": []
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

#### Get Hotel Request by ID

Retrieve a specific hotel request by ID.

**Endpoint:** `GET /hotel-requests/:id`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "New Hotel",
    "status": "pending",
    "images": []
  }
}
```

**Error Responses:**
- `404 Not Found`: Hotel request not found
- `500 Internal Server Error`: Server error

### Hotel Requests (Admin)

#### Get Pending Hotel Requests

Retrieve all pending hotel requests (admin only).

**Endpoint:** `GET /hotel-requests/pending`

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "New Hotel",
      "status": "pending",
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890"
      },
      "images": []
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

#### Get All Hotel Requests

Retrieve all hotel requests with optional status filter (admin only).

**Endpoint:** `GET /hotel-requests/all?status=<status>`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "New Hotel",
      "status": "pending",
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890"
      },
      "images": []
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

#### Update Hotel Request Status

Approve or reject a hotel request (admin only).

**Endpoint:** `PATCH /hotel-requests/request/:id/status`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "status": "approved",
  "adminNotes": "Approved for listing"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Hotel request approved successfully",
  "data": {
    "id": 1,
    "name": "New Hotel",
    "status": "approved",
    "adminNotes": "Approved for listing",
    "createdHotel": {
      "id": 5,
      "name": "New Hotel"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid status or request already processed
- `404 Not Found`: Hotel request not found
- `500 Internal Server Error`: Server error

### Bookings

#### Create Booking

Create a new hotel booking.

**Endpoint:** `POST /bookings`

**Authentication:** Required

**Request Body:**
```json
{
  "hotelId": 1,
  "roomTypeId": 1,
  "checkInDate": "2024-06-01",
  "checkOutDate": "2024-06-05",
  "specialRequests": "Late check-in requested"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "bookingNumber": "BK123456",
    "checkInDate": "2024-06-01",
    "checkOutDate": "2024-06-05",
    "totalAmount": 600,
    "status": "pending",
    "paymentStatus": "pending",
    "Hotel": {
      "name": "Grand Hotel",
      "address": "123 Main Street",
      "city": "New York"
    },
    "BookingRooms": [
      {
        "RoomType": {
          "name": "Deluxe Room",
          "basePrice": 150
        }
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid dates, hotel not found, or room type not found
- `500 Internal Server Error`: Server error

#### Get User Bookings

Retrieve all bookings for the authenticated user.

**Endpoint:** `GET /bookings/my-bookings`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": 1,
        "bookingNumber": "BK123456",
        "status": "confirmed",
        "Hotel": {
          "name": "Grand Hotel",
          "city": "New York"
        }
      }
    ]
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

#### Get Booking by ID

Retrieve a specific booking by ID.

**Endpoint:** `GET /bookings/:id`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": 1,
      "bookingNumber": "BK123456",
      "status": "confirmed",
      "Hotel": {
        "name": "Grand Hotel",
        "city": "New York"
      }
    }
  }
}
```

**Error Responses:**
- `404 Not Found`: Booking not found
- `500 Internal Server Error`: Server error

#### Process Payment

Process payment for a booking (simulation).

**Endpoint:** `POST /bookings/:id/payment`

**Authentication:** Required

**Request Body:**
```json
{
  "paymentMethod": "credit_card"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": 1,
    "bookingNumber": "BK123456",
    "paymentStatus": "paid",
    "status": "confirmed"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Booking not found, already paid, or payment failed
- `500 Internal Server Error`: Server error

#### Cancel Booking

Cancel a booking.

**Endpoint:** `POST /bookings/:id/cancel`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": 1,
    "bookingNumber": "BK123456",
    "status": "cancelled"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Booking not found or already cancelled
- `500 Internal Server Error`: Server error

### Media

#### Get Upload Authentication

Get authentication parameters for direct image upload to media provider.

**Endpoint:** `GET /media/upload-auth`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "apiKey": "your_api_key",
    "uploadEndpoint": "https://upload.example.com",
    "signature": "signature_string"
  }
}
```

**Error Responses:**
- `500 Internal Server Error`: Failed to generate authentication parameters

## Error Handling

All endpoints return errors in the standardized format. Clients should check the `success` field and handle errors accordingly.

**Example Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

## Rate Limiting

Currently, rate limiting is not implemented. This may be added in future versions.

## Versioning

This API is currently at version 1.0. Future versions may include versioning in the URL path (e.g., `/api/v2/...`).

## Support

For API-related issues or questions, please contact the development team.
