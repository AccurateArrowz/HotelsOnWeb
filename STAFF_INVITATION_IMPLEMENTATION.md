# Staff Invitation Feature Implementation

## Overview
Complete implementation of a staff invitation system for HotelsOnWeb, allowing hotel owners to invite staff members (managers, receptionists) to join their hotels. Invitees receive email invitations and can accept by creating their accounts.

## Tech Stack
- **Backend Email**: Resend (React Email templates)
- **Frontend Styling**: Tailwind CSS
- **Database**: PostgreSQL with Sequelize ORM
- **API**: Express.js with JWT authentication
- **Frontend**: React with RTK Query for data fetching

---

## Backend Implementation

### Database Changes

#### Migration: `20260806120000-create-invitations-table.js`
- Creates `Invitations` table with:
  - `hotelId`, `invitedEmail`, `invitedBy`, `roleId` (foreign keys)
  - `token` (unique, secure invite link)
  - `tokenExpiresAt` (7-day expiry)
  - `status` (pending, accepted, expired, cancelled)
  - `acceptedAt`, `acceptedByUserId` (tracking)
- Adds `status` column to `HotelStaffs` table (active, inactive, suspended)
- Creates indexes on `token` and `(invitedEmail, hotelId)` for fast lookups

### Models

#### `Invitation.ts`
Sequelize model representing staff invitations with relationships to:
- `Hotel` (which hotel they're invited to)
- `User` (inviter and acceptor)
- `Role` (assigned role: manager, receptionist)

### Services

#### `EmailService.ts`
Sends transactional emails using Resend with HTML templates:
- Professional email design with hotel branding
- Invitation details (hotel name, role, inviter)
- Secure accept link with token
- 7-day expiry notice

#### `InvitationService.ts`
Core business logic:
- `createAndSendInvitation()` - Validate, create invitation, send email
- `acceptInvitation()` - Verify token, create user account, create HotelStaff record
- `getPendingInvitations()` - Fetch pending invites with pagination
- `resendInvitation()` - Resend email for pending invitations
- `cancelInvitation()` - Cancel pending invitations
- `getInvitationByToken()` - Public endpoint for accept page

### Repository

#### `InvitationRepository.ts`
Data access layer with methods:
- `findByToken()` - Get invitation by secure token
- `findPendingByHotel()` - Get pending invites for a hotel
- `findByHotelAndEmail()` - Check for duplicate invites
- `isValidInvitation()` - Validate token and status
- `markAsAccepted/Expired/Cancelled()` - Update invitation status
- `hasPendingInvitation()` - Check for existing pending invite

### Middleware

#### `requireHotelOwner.ts`
Verifies that authenticated user is an owner of the specified hotel:
- Checks `HotelOwner` junction table
- Returns 403 Forbidden if not an owner
- Attaches `hotelId` to request for use in controllers

### Routes & Controller

#### `InvitationController.ts`
HTTP endpoints:
- `POST /invitations` - Accept invitation (public)
- `GET /invitations/:token` - Get invite details (public)
- `POST /hotels/:hotelId/invitations` - Create invitation (owner only)
- `GET /hotels/:hotelId/invitations` - Get pending invites (owner only)
- `POST /hotels/:hotelId/invitations/:id/resend` - Resend email (owner only)
- `DELETE /hotels/:hotelId/invitations/:id` - Cancel invitation (owner only)

### Shared Schemas

#### `invitation.schema.ts` (Zod validation)
- `CreateInvitationSchema` - Email + roleId
- `AcceptInvitationSchema` - Token + name + password + phone
- `GetInvitationsSchema` - Pagination + status filter
- `ResendInvitationSchema` - Invitation ID
- `CancelInvitationSchema` - Invitation ID

---

## Frontend Implementation

### API Integration

#### `invitationsApi.ts` (RTK Query)
Endpoints:
- `createInvitation()` - Send invitation
- `getPendingInvitations()` - Fetch pending invites with pagination
- `getInvitationByToken()` - Get invite details (public)
- `acceptInvitation()` - Accept and create account
- `resendInvitation()` - Resend email
- `cancelInvitation()` - Cancel invite

### Components

#### `InviteStaff.jsx` + `InviteStaff.css`
Owner-facing component for managing staff invitations:
- **New Invitation Form**: Email + role selection
- **Pending Invitations List**: Shows all pending invites with:
  - Email address
  - Assigned role
  - Status badge (Pending)
  - Actions: Resend, Cancel
- **Modal Dialog**: Detailed form for sending invitations
- **Tailwind CSS**: Professional design matching screenshot

#### `AcceptInvitePage.jsx` + `AcceptInvitePage.css`
Public page for invited staff to accept invitations:
- **Invitation Details**: Hotel name, role, inviter name
- **Account Creation Form**:
  - First/Last name
  - Email (read-only)
  - Phone (optional)
  - Password + confirm password (with show/hide toggle)
- **Validation**: Client-side form validation
- **Success Flow**: Redirect to login after account creation
- **Tailwind CSS**: Gradient header, professional form styling

### Integration with MyHotelPage

#### Updated Navigation
Added "Staff" tab to hotel management sidebar with Users icon

#### Content Map
Wired `InviteStaff` component to render when "Staff" tab is active

### Routes

#### `App.jsx`
Added public route:
- `GET /accept-invite?token=<token>` - Accept invitation page

---

## Security Features

### Email Validation
- Checks for existing users before sending invites
- Prevents duplicate pending invitations
- Validates email format

### Token Security
- 32-byte random tokens (256-bit entropy)
- Tokens expire after 7 days
- One-time use (marked as accepted after use)
- Tokens are unique per invitation

### Role-Based Access Control
- Only hotel owners can send invitations
- `requireHotelOwner` middleware verifies ownership
- Backend enforces role permissions on all endpoints

### Account Creation
- Passwords hashed with bcryptjs (12 rounds)
- Email uniqueness enforced
- New staff users created with `status: 'active'`
- Linked to hotel via `HotelStaff` record

---

## API Endpoints Summary

### Public Endpoints
```
GET    /api/invitations/:token
       → Get invitation details by token

POST   /api/invitations/accept
       → Accept invitation and create account
```

### Protected Endpoints (Owner Only)
```
POST   /api/invitations/hotels/:hotelId/invitations
       → Create and send invitation

GET    /api/invitations/hotels/:hotelId/invitations?status=pending&limit=20&offset=0
       → Get pending invitations with pagination

POST   /api/invitations/hotels/:hotelId/invitations/:id/resend
       → Resend invitation email

DELETE /api/invitations/hotels/:hotelId/invitations/:id
       → Cancel invitation
```

### Additional Endpoints
```
GET    /api/hotels/owner/my-hotels
       → Get current user's owned hotels (for hotel switcher)
```

---

## Environment Variables Required

### Backend (.env)
```env
RESEND_API_KEY=<your-resend-api-key>
FRONTEND_URL=http://localhost:5173  # For invitation links
```

### Database
Uses existing PostgreSQL connection (DATABASE_URL or individual DB_* vars)

---

## File Structure

### Backend
```
backend/src/
├── features/invitation/
│   ├── invitation.controller.ts
│   ├── invitation.service.ts
│   ├── invitation.repository.ts
│   ├── invitation.routes.ts
│   └── index.ts
├── middleware/
│   └── hotel-owner.middleware.ts
├── models/
│   └── Invitation.ts
├── services/
│   └── email.service.ts
└── migrations/
    └── 20260806120000-create-invitations-table.js
```

### Frontend
```
frontend/src/features/owner/
├── components/
│   ├── InviteStaff.jsx
│   └── InviteStaff.css
├── pages/
│   ├── AcceptInvitePage.jsx
│   └── AcceptInvitePage.css
├── invitationsApi.ts
└── pages/MyHotelPage.jsx (updated)
```

### Shared
```
shared/src/schemas/
└── invitation.schema.ts
```

---

## Testing Checklist

- [ ] Build shared package: `npm run build:shared`
- [ ] Build backend: `cd backend && npm run build`
- [ ] Run migrations: `npm run migrate`
- [ ] Test invitation creation (owner only)
- [ ] Test email sending (check Resend dashboard)
- [ ] Test invitation acceptance (create account)
- [ ] Test token expiry (after 7 days)
- [ ] Test duplicate prevention
- [ ] Test role-based access control
- [ ] Test frontend form validation
- [ ] Test password visibility toggle
- [ ] Test responsive design on mobile

---

## Future Enhancements

1. **Bulk Invitations**: CSV upload for multiple staff
2. **Invitation Templates**: Customizable email templates per hotel
3. **Invitation History**: Archive of accepted/expired invitations
4. **Permissions Management**: Custom permissions per staff member
5. **Two-Factor Authentication**: Optional 2FA for staff accounts
6. **Invitation Analytics**: Track acceptance rates and response times
7. **Scheduled Invitations**: Send invitations at specific times
8. **Invitation Reminders**: Auto-send reminders before expiry

---

## Notes

- Email service uses Resend (React Email compatible)
- All passwords are hashed with bcryptjs before storage
- Invitations are scoped to hotels (can't invite to multiple hotels at once)
- Staff accounts are created with `roleId: null` (hotel-specific roles only)
- The `HotelStaff` record links users to hotels with specific roles
- Tailwind CSS is used for all frontend styling (no vanilla CSS)
