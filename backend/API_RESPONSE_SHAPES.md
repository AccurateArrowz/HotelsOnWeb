# API Response Shapes

This document describes the standard shapes for all success and error responses returned by this API.

---

## Table of Contents

- [Core Envelope](#core-envelope)
- [Success Responses](#success-responses)
  - [Generic Success](#generic-success)
  - [Auth — Register / Login / Refresh Token](#auth--register--login--refresh-token)
  - [Auth — Logout](#auth--logout)
  - [Hotels — Get Single Hotel](#hotels--get-single-hotel)
  - [Hotels — Search Hotels (paginated)](#hotels--search-hotels-paginated)
  - [Hotels — Get My Hotels (owner)](#hotels--get-my-hotels-owner)
  - [Room Types — List / Get One](#room-types--list--get-one)
  - [Room Types — Create / Update](#room-types--create--update)
  - [Room Types — Delete](#room-types--delete)
  - [Rooms — List by Hotel](#rooms--list-by-hotel)
  - [Rooms — Get / Create / Update](#rooms--get--create--update)
  - [Rooms — Delete](#rooms--delete)
  - [Bookings — Create Booking](#bookings--create-booking)
  - [Bookings — List / Get One](#bookings--list--get-one)
  - [Bookings — Process Payment](#bookings--process-payment)
  - [Bookings — Cancel Booking](#bookings--cancel-booking)
  - [Room Availability — Hotel-wide](#room-availability--hotel-wide)
  - [Room Availability — Single Room Type](#room-availability--single-room-type)
  - [Hotel Requests — Create](#hotel-requests--create)
  - [Hotel Requests — List / Get One](#hotel-requests--list--get-one)
  - [Hotel Requests — Update Status (admin)](#hotel-requests--update-status-admin)
  - [Media — Get Upload Auth](#media--get-upload-auth)
- [Error Responses](#error-responses)
  - [Validation Error (400)](#validation-error-400)
  - [Bad Request (400)](#bad-request-400)
  - [Unauthorized (401)](#unauthorized-401)
  - [Auth Middleware Errors (401 / 403 / 500)](#auth-middleware-errors-401--403--500)
  - [Forbidden (403)](#forbidden-403)
  - [Not Found (404)](#not-found-404)
  - [Conflict (409)](#conflict-409)
  - [Internal Server Error (500)](#internal-server-error-500)
  - [Unhandled Error (global middleware)](#unhandled-error-global-middleware)

---

## Core Envelope

Every response produced by `apiResponse.js` follows this envelope:

```json
{
  "success": true | false,
  ...extraFields
}
```

`success: true` for all 2xx responses; `success: false` for all error responses.

---

## Success Responses

### Generic Success

**Status:** `200 OK` (or `201 Created` where noted)

```json
{
  "success": true,
  "data": <payload>,
  "message": "Optional human-readable message"
}
```

---

### Auth — Register / Login / Refresh Token

**Status:** `201 Created` (register) / `200 OK` (login, refresh)

A `refreshToken` is also set as an `httpOnly` cookie — it is **not** present in the JSON body.

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "roleId": 2
    },
    "accessToken": "<JWT string>"
  },
  "message": "User registered successfully"
  // or "Login successful" / "Token refreshed successfully"
}
```

---

### Auth — Logout

**Status:** `200 OK`

The `refreshToken` cookie is cleared on logout.

```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

---

### Hotels — Get Single Hotel

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Grand Hotel",
    "street": "123 Main St",
    "city": "Paris",
    "country": "France",
    "description": "...",
    "isActive": true,
    "images": [
      {
        "id": 10,
        "imageUrl": "https://...",
        "isPrimary": true,
        "orderIndex": 0
      },
      {
        "id": "shared-0",
        "imageUrl": "https://ik.imagekit.io/.../reception .jpg",
        "isPrimary": false,
        "orderIndex": 1
      }
    ],
    "roomTypes": [
      {
        "id": 3,
        "hotelId": 1,
        "name": "Deluxe Suite",
        "description": "...",
        "basePrice": "199.99",
        "adults": 2,
        "children": 1
      }
    ]
  }
}
```

---

### Hotels — Search Hotels (paginated)

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Grand Hotel",
      "city": "Paris",
      "country": "France",
      "isActive": true,
      "hotelImg": "https://..."
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Hotels — Get My Hotels (owner)

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Grand Hotel",
      "street": "123 Main St",
      "city": "Paris",
      "country": "France",
      "isActive": true,
      "images": [ { "id": 10, "imageUrl": "https://...", "isPrimary": true, "orderIndex": 0 } ],
      "roomTypes": [ { "id": 3, "name": "Deluxe Suite", "basePrice": "199.99", "isActive": true } ],
      "rooms": [ { "id": 5, "roomNumber": "101", "status": "available" } ]
    }
  ]
}
```

---

### Room Types — List / Get One

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "hotelId": 1,
      "name": "Deluxe Suite",
      "description": "Spacious suite with ocean view",
      "basePrice": "199.99",
      "adults": 2,
      "children": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

`GET` single room type also includes a nested `rooms` array:

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Deluxe Suite",
    "rooms": [
      { "id": 5, "roomNumber": "101", "status": "available" }
    ]
  }
}
```

---

### Room Types — Create / Update

**Status:** `201 Created` (create) / `200 OK` (update)

```json
{
  "success": true,
  "data": {
    "id": 3,
    "hotelId": 1,
    "name": "Deluxe Suite",
    "description": "Spacious suite with ocean view",
    "basePrice": "199.99",
    "adults": 2,
    "children": 1,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Room type created successfully"
  // or "Room type updated successfully"
}
```

---

### Room Types — Delete

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Room type deleted successfully"
}
```

---

### Rooms — List by Hotel

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "hotelId": 1,
      "roomTypeId": 3,
      "roomNumber": "101",
      "floor": 1,
      "adults": 2,
      "children": 0,
      "status": "occupied",
      "isActive": true,
      "roomType": { "id": 3, "name": "Deluxe Suite", "basePrice": "199.99" },
      "currentGuest": "J. Doe"
    }
  ]
}
```

`currentGuest` is `null` for non-occupied rooms, or a formatted string `"F. LastName"` for occupied rooms.

---

### Rooms — Get / Create / Update

**Status:** `200 OK` (get / update) / `201 Created` (create)

```json
{
  "success": true,
  "data": {
    "id": 5,
    "hotelId": 1,
    "roomTypeId": 3,
    "roomNumber": "101",
    "floor": 1,
    "adults": 2,
    "children": 0,
    "status": "available",
    "isActive": true,
    "roomType": { "id": 3, "name": "Deluxe Suite", "basePrice": "199.99" }
  },
  "message": "Room created successfully"
  // or "Room updated successfully"
}
```

---

### Rooms — Delete

**Status:** `200 OK`

```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

---

### Bookings — Create Booking

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 42,
    "bookingNumber": "BK-00042",
    "userId": 1,
    "hotelId": 1,
    "checkInDate": "2024-06-01",
    "checkOutDate": "2024-06-05",
    "totalAmount": "799.96",
    "specialRequests": "Late check-in please",
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "hotel": {
      "name": "Grand Hotel",
      "street": "123 Main St",
      "city": "Paris",
      "country": "France"
    },
    "bookingRooms": [
      {
        "id": 10,
        "bookingId": 42,
        "roomTypeId": 3,
        "roomId": null,
        "pricePerNight": "199.99",
        "numberOfNights": 4,
        "totalPrice": "799.96",
        "roomType": { "name": "Deluxe Suite", "basePrice": "199.99" }
      }
    ]
  },
  "message": "Booking created successfully"
}
```

---

### Bookings — List / Get One

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "bookingNumber": "BK-00042",
      "userId": 1,
      "hotelId": 1,
      "checkInDate": "2024-06-01",
      "checkOutDate": "2024-06-05",
      "totalAmount": "799.96",
      "status": "confirmed",
      "paymentStatus": "paid",
      "hotel": { "name": "Grand Hotel", "street": "123 Main St", "city": "Paris", "country": "France" },
      "bookingRooms": [
        {
          "id": 10,
          "roomTypeId": 3,
          "pricePerNight": "199.99",
          "numberOfNights": 4,
          "totalPrice": "799.96",
          "roomType": { "name": "Deluxe Suite", "basePrice": "199.99" }
        }
      ]
    }
  ]
}
```

`data` is an array for list endpoints and a single object for the `GET /bookings/:id` endpoint.

---

### Bookings — Process Payment

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 42,
    "bookingNumber": "BK-00042",
    "paymentStatus": "paid",
    "status": "confirmed"
  },
  "message": "Payment processed successfully"
}
```

---

### Bookings — Cancel Booking

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 42,
    "bookingNumber": "BK-00042",
    "status": "cancelled"
  },
  "message": "Booking cancelled successfully"
}
```

---

### Room Availability — Hotel-wide

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "hotelId": 1,
    "checkInDate": "2024-06-01",
    "checkOutDate": "2024-06-05",
    "roomTypes": [
      {
        "id": 3,
        "name": "Deluxe Suite",
        "basePrice": "199.99",
        "available": true,
        "availableRooms": 3,
        "totalRooms": 5
      }
    ]
  }
}
```

---

### Room Availability — Single Room Type

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "roomTypeId": 3,
    "available": true,
    "availableRooms": 3,
    "totalRooms": 5
  }
}
```

> The exact shape of `data` for availability endpoints is determined by `roomAvailabilityService`.

---

### Hotel Requests — Create

**Status:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": 7,
    "userId": 1,
    "name": "Beach Resort",
    "description": "A beautiful beachfront resort",
    "street": "1 Ocean Drive",
    "city": "Miami",
    "country": "USA",
    "status": "pending",
    "adminNotes": null,
    "processedAt": null,
    "processedBy": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "images": [
      {
        "id": 20,
        "hotelRequestId": 7,
        "imageUrl": "https://...",
        "isPrimary": true,
        "orderIndex": 0
      }
    ]
  },
  "message": "Hotel listing request submitted successfully"
}
```

---

### Hotel Requests — List / Get One

**Status:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 7,
      "name": "Beach Resort",
      "status": "pending",
      "street": "1 Ocean Drive",
      "city": "Miami",
      "country": "USA",
      "images": [
        { "id": 20, "imageUrl": "https://...", "isPrimary": true, "orderIndex": 0 }
      ]
    }
  ]
}
```

Admin list also includes a `user` object and transformed fields:

```json
{
  "success": true,
  "data": [
    {
      "id": 7,
      "name": "Beach Resort",
      "hotelName": "Beach Resort",
      "address": "1 Ocean Drive",
      "street": "1 Ocean Drive",
      "ownerId": 1,
      "ownerName": "Jane Doe",
      "status": "pending",
      "images": [ { "id": 20, "imageUrl": "https://...", "isPrimary": true, "orderIndex": 0 } ],
      "user": {
        "id": 1,
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com",
        "phone": "+1234567890"
      }
    }
  ]
}
```

---

### Hotel Requests — Update Status (admin)

**Status:** `200 OK`

When `status` is `"approved"`, a hotel is automatically created and its reference is included:

```json
{
  "success": true,
  "id": 7,
  "name": "Beach Resort",
  "status": "approved",
  "adminNotes": "Looks great!",
  "processedAt": "2024-01-02T10:00:00.000Z",
  "processedBy": 99,
  "createdHotel": {
    "id": 1,
    "name": "Beach Resort"
  }
}
```

When `status` is `"rejected"`, `createdHotel` is `null`:

```json
{
  "success": true,
  "id": 7,
  "status": "rejected",
  "adminNotes": "Incomplete information",
  "createdHotel": null
}
```

> **Note:** This endpoint spreads the hotel request fields directly into the envelope rather than nesting under `data`.

---

### Media — Get Upload Auth

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "token": "<imagekit-auth-token>",
    "expire": 1700000000,
    "signature": "<hmac-signature>"
  }
}
```

---

## Error Responses

### Validation Error (400)

Produced by the `validate` Zod middleware when request body/query/params fail schema validation.

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "body.email", "message": "Invalid email" },
    { "field": "body.password", "message": "Required" }
  ]
}
```

---

### Bad Request (400)

General client-side error (invalid input, business rule violation, etc.).

```json
{
  "success": false,
  "message": "Check-in date cannot be in the past"
}
```

---

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Common `message` values:
- `"Unauthorized"`
- `"Refresh token is required"`
- `"Invalid refresh token"`
- `"Refresh token expired"`

---

### Auth Middleware Errors (401 / 403 / 500)

Errors from `authenticateToken` and `requireAdmin` follow the standard envelope shape:

```json
{ "success": false, "message": "Access denied. No token provided." }
{ "success": false, "message": "Invalid token." }
{ "success": false, "message": "Token expired." }
{ "success": false, "message": "Invalid token type." }
{ "success": false, "message": "Invalid token. User not found." }
{ "success": false, "message": "Authentication required." }
{ "success": false, "message": "Access denied. Admin privileges required." }
{ "success": false, "message": "Server error during authentication." }
{ "success": false, "message": "Server error during authorization." }
```

---

### Forbidden (403)

```json
{
  "success": false,
  "message": "Not authorized to view this hotel's rooms"
}
```

---

### Not Found (404)

```json
{
  "success": false,
  "message": "Hotel not found"
}
```

---

### Conflict (409)

```json
{
  "success": false,
  "message": "An account with this email already exists"
}
```

---

### Internal Server Error (500)

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### Unhandled Error (global middleware)

Errors that reach the global Express error handler (i.e. not caught by a controller) follow the standard envelope shape:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Summary Table

| Scenario | Status | `success` | Key fields |
|---|---|---|---|
| Success (general) | 200 / 201 | `true` | `data`, `message?` |
| Success (paginated) | 200 | `true` | `data[]`, `pagination` |
| Validation error | 400 | `false` | `message`, `errors[]` |
| Bad request | 400 | `false` | `message` |
| Unauthorized | 401 | `false` | `message` |
| Auth middleware error | 401 / 403 / 500 | `false` | `message` |
| Forbidden | 403 | `false` | `message` |
| Not found | 404 | `false` | `message` |
| Conflict | 409 | `false` | `message` |
| Internal server error | 500 | `false` | `message` |
| Unhandled global error | 500 | `false` | `message` |
