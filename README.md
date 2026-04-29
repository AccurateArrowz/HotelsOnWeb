# HotelsOnWeb

A full-stack hotel booking platform connecting travelers with accommodations. Built with a focus on clean architecture, scalable database design, and role-based access control.

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://hotels-on-web.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-3e404f?logo=render)](https://hotelsonweb.onrender.com/api)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)](https://redux-toolkit.js.org)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql)](https://www.postgresql.org)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?logo=sequelize)](https://sequelize.org)

## Live Demo

- **Frontend**: [Visit Site](https://hotels-on-web.vercel.app/)
- **Backend API**: [API Link](https://hotelsonweb.onrender.com/api)

> **Note**: Backend hosted on Render free tier—cold start may take 30-60 seconds.

---

## Features

### For Travelers
- **Search & Filter**: Find hotels by city, dates, and guest count
- **Detailed Listings**: Room types, amenities, pricing, and photos
- **Booking Flow**: Date selection, guest info, and payment simulation
- **Booking Management**: View history, cancel bookings, track status

### For Hotel Owners
- **Property Listing**: Submit hotels for admin approval
- **Dashboard**: Manage rooms, room types, and availability
- **Bookings**: View and manage guest reservations

### For Admins
- **Approval Workflow**: Review and approve hotel listings
- **Request Management**: Handle property submissions with status tracking

### Technical Highlights
- **Enterprise-Grade RBAC**: Fine-grained access control for Guests, Users, Hotel Owners, and Admins.
- **Advanced Database Design**: Scalable PostgreSQL schema with junction tables for complex booking scenarios and JSONB for flexible hotel amenities.
- **Optimized Media Pipeline**: Seamless image uploads via ImageKit with automated on-the-fly transformations and optimizations.
- **Type-Safe Validation**: Unified validation strategy using Zod schemas shared between frontend and backend.
- **Responsive UX**: Mobile-first design using Tailwind CSS v4, providing a consistent experience across all devices.
- **Modern State Management**: Efficient data fetching and caching with RTK Query, reducing redundant network requests.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI library with concurrent features |
| TypeScript | Type-safe development |
| Vite | Fast build tool and dev server |
| Redux Toolkit + RTK Query | State management and data fetching |
| React Router v6 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| React Hook Form | Form handling with Zod validation |
| Recharts | Data visualization for dashboards |
| Lucide React | Icon library |
| Jest + React Testing Library | Unit testing |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js 5 | Web framework |
| TypeScript | Type-safe development |
| Sequelize ORM | PostgreSQL abstraction |
| PostgreSQL | Relational database (hosted on Neon) |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| ImageKit | Image upload and optimization |
| Zod | Runtime schema validation |

### Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │────▶│   hotels    │────▶│  room_types │
│  (auth)     │     │ (listings)  │     │ (categories)│
└─────────────┘     └─────────────┘     └──────┬──────┘
       │                                       │
       │    ┌─────────────┐     ┌────────────┐ │
       └───▶│  bookings   │◀────│   rooms    │◀┘
              │(reservations)│     │(inventory) │
              └─────────────┘     └────────────┘
                    │
                    ▼
              ┌─────────────┐
              │ booking_rooms│
              │ (junction)   │
              └─────────────┘
```

**Key Design Decisions**:
- `booking_rooms` junction table for multi-room bookings with per-room pricing
- Custom hotel ID generation (acronym + random number for SEO-friendly URLs)
- Soft deletes and status tracking for audit trails

---

## Project Structure

```
HotelsOnWeb/
├── frontend/                 # React SPA (Vite)
│   ├── src/
│   │   ├── app/             # App shell: routing, global store, top-level providers
│   │   ├── features/        # Domain-driven modules (auth, hotels, bookings, etc.)
│   │   ├── shared/          # Reusable UI components, hooks, and utilities
│   │   └── services/        # External service configurations
│   └── package.json
│
├── backend/                  # Express API (Node.js)
│   ├── src/
│   │   ├── controllers/     # Resource-specific request handlers
│   │   ├── routes/          # Express route definitions
│   │   ├── models/          # Sequelize models and associations
│   │   ├── middleware/      # Auth, validation, and error handling
│   │   ├── services/        # Business logic and complex operations
│   │   └── validations/     # Zod schema definitions
│   ├── migrations/          # Sequelize database migrations
│   ├── config/              # Database and app configuration
│   └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 17+
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
git clone https://github.com/AccurateArrowz/HotelsOnWeb.git
cd HotelsOnWeb

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

2. **Environment Setup**:

Backend `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotels_on_web
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

3. **Database Setup**:
```bash
cd backend

# Run migrations
npm run migrate

# Seed sample data (optional)
npm run seed
```

4. **Start Development**:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3001`.

---

## API Overview

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/register` | POST | User registration | Public |
| `/api/auth/login` | POST | User login | Public |
| `/api/hotels` | GET | List hotels by city | Public |
| `/api/hotels/:id` | GET | Hotel details | Public |
| `/api/bookings` | POST | Create booking | Required |
| `/api/bookings/user` | GET | User's bookings | Required |
| `/api/room-types` | GET/POST | Room type CRUD | Required |
| `/api/rooms` | GET/POST | Room inventory CRUD | Required |
| `/api/hotel-requests` | GET/POST | Hotel approval workflow | Admin/Owner |
| `/api/media/auth` | GET | ImageKit auth params | Required |

Full API documentation: [`backend/README.md`](./backend/README.md)

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Backend (Render)
1. Create Web Service from GitHub
2. Set root directory to `backend`
3. Add PostgreSQL instance
4. Configure environment variables
5. Deploy

---

## Scripts Reference

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run test      # Run Jest tests
npm run lint      # ESLint check
```

### Backend
```bash
npm run dev       # Start with nodemon
npm run build     # Compile TypeScript
npm start         # Run compiled code
npm run migrate   # Run Sequelize migrations
npm run seed      # Seed database
npm run db:reset  # Reset and reseed
```

---

## Future Enhancements

- [ ] Real-time availability with WebSockets
- [ ] Payment gateway integration (Stripe)
- [ ] Email notifications (SendGrid)
- [ ] OAuth authentication (Google, Facebook)
- [ ] PWA for mobile app experience

---

## License

MIT License - feel free to use this project for learning or building your own booking platform.

---

## Author

**Sujay Shrestha**

- [LinkedIn](http://www.linkedin.com/in/sujay-shrestha-8a846b358)
- Email: sujayshresth10@gmail.com


